/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { UploadRequestDto } from './dto/UploadRequest.dto';
import { createError400 } from 'src/utils/Error400';
import { InputFormats, ValidImageFormats } from 'src/constants';
import cloudinary from './config/cloudinary.config';
import { ConverterService } from 'src/converter/converter.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { StorageConfig } from 'src/config/storage.config';
import { UploadedFile } from 'src/types/UploadedFile';
import { FileURL } from 'src/types/FileURL';

@Injectable()
export class UploadService {
  constructor(
    private readonly converterService: ConverterService,
    private readonly prisma: PrismaService
  ) {}

  validateRequest(request: UploadRequestDto) {
    const requiredFields: Array<[keyof UploadRequestDto, string]> = [
      ['file', 'File'],
      ['thumbnailImage', 'Thumbnail image'],
      ['title', 'Title'],
      ['description', 'Description'],
      ['category', 'Category'],
      ['license', 'License'],
      ['expiresIn', 'Expires in'],
      ['userIP', 'User IP'],
    ];

    for (const [field, label] of requiredFields) {
      if (!request[field]) {
        return createError400(`${label} is required`);
      }
    }

    const fileExt = request.file.originalname.split('.').pop()?.toLowerCase() || '';
    const isValidFileFormat = InputFormats.includes(fileExt);
    if (!isValidFileFormat) {
      return createError400(`Invalid file format`);
    }
    const thumbnailExt = request.thumbnailImage.originalname.split('.').pop()?.toLowerCase() || '';
    const isValidThumbnailFormat = ValidImageFormats.includes(thumbnailExt);
    if (!isValidThumbnailFormat) {
      return createError400(`Invalid thumbnail format`);
    }

    return { success: true };
  }

  async uploadToCloudinary(file: Express.Multer.File, folder: string) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: folder,
      });
      return { success: true, result };
    } catch (error) {
      return {
        success: false,
        result: error,
      };
    }
  }

  async deleteFromCloudinary(
    publicId: string,
    folder: string,
    resourceType: 'raw' | 'image' | 'video' = 'raw'
  ) {
    try {
      const result = await cloudinary.uploader.destroy(`${publicId}`, {
        resource_type: resourceType,
      });
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to delete file ${publicId} from ${folder}:`, error);
      return {
        success: false,
        result: 'Failed to delete file from cloudinary',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processUploadWithCleanup(
    file: Express.Multer.File,
    thumbnailImage: Express.Multer.File,
    fileURL: FileURL
  ) {
    const uploadedFiles: UploadedFile[] = [];

    const cleanupUploadedFiles = async () => {
      for (const uploadedFile of uploadedFiles) {
        try {
          await this.deleteFromCloudinary(
            uploadedFile.public_id,
            uploadedFile.folder,
            uploadedFile.resourceType
          );
        } catch (error) {
          return {
            success: false,
            error: `Failed to cleanup file ${uploadedFile.public_id}: ${error}`,
          };
        }
      }
    };

    const handleError = async (errorCode: string, message: string, details?: unknown) => {
      await cleanupUploadedFiles();
      return {
        success: false,
        error: errorCode,
        message,
        details,
      };
    };

    const fileExt = file.originalname.split('.').pop()?.toLowerCase();
    const isAlreadyObjFormat = fileExt === 'obj';

    const response = {
      success: true,
      file: false,
      thumbnail: false,
      convertedFile: false,
      wasConverted: !isAlreadyObjFormat,
    };

    if (!isAlreadyObjFormat) {
      const conversionResult = await this.converterService.convertToMultipleFormats(file, ['obj']);
      try {
        if (conversionResult.success) {
          const convertedFileForUpload: Express.Multer.File = {
            ...file,
            path: conversionResult.filePath,
            originalname: path.basename(conversionResult.filePath),
            mimetype: 'application/octet-stream',
          };

          const uploadResult = await this.uploadToCloudinary(
            convertedFileForUpload,
            'convertedToObj'
          );

          if (uploadResult.success) {
            response.convertedFile = true;
            uploadedFiles.push({
              public_id: (uploadResult.result as { public_id: string }).public_id,
              folder: 'convertedToObj',
              resourceType: 'raw',
            });
            fileURL.convertedModelURL = (uploadResult.result as { secure_url: string }).secure_url;
          } else {
            fileURL.convertedModelURL = '';
            fileURL.rawModelURL = '';
            fileURL.thumbnailImageURL = '';
            return await handleError(
              'CONVERTED_FILE_UPLOAD_FAILED',
              'Failed to upload converted .obj file to cloud storage',
              {
                originalFile: file.originalname,
                convertedFile: path.basename(conversionResult.filePath),
                cloudinaryResponse: uploadResult,
              }
            );
          }
        } else {
          fileURL.convertedModelURL = '';
          fileURL.rawModelURL = '';
          fileURL.thumbnailImageURL = '';
          return await handleError('CONVERSION_FAILED', 'Failed to convert file to .obj format', {
            originalFile: file.originalname,
            conversionError: conversionResult.error,
          });
        }
      } catch (error) {
        fileURL.convertedModelURL = '';
        fileURL.rawModelURL = '';
        fileURL.thumbnailImageURL = '';
        return await handleError('CONVERSION_ERROR', 'Error occurred during file conversion', {
          originalFile: file.originalname,
          error: error instanceof Error ? error.message : 'Unknown conversion error',
        });
      }
    }

    if (isAlreadyObjFormat) {
      try {
        const uploadResult = await this.uploadToCloudinary(file, 'convertedToObj');
        if (uploadResult.success) {
          response.convertedFile = true;
          const localFilePath = path.join(StorageConfig.CONVERTED_TO_OBJ_PATH, file.originalname);
          if (file.buffer) {
            fs.writeFileSync(localFilePath, file.buffer);
          } else if (file.path) {
            fs.copyFileSync(file.path, localFilePath);
          }

          uploadedFiles.push({
            public_id: (uploadResult.result as { public_id: string }).public_id,
            folder: 'convertedToObj',
            resourceType: 'raw',
          });
          fileURL.convertedModelURL = (uploadResult.result as { secure_url: string }).secure_url;
        } else {
          fileURL.convertedModelURL = '';
          fileURL.rawModelURL = '';
          fileURL.thumbnailImageURL = '';
          return await handleError(
            'OBJ_FILE_UPLOAD_FAILED',
            'Failed to upload .obj file to cloud storage',
            {
              file: file.originalname,
              cloudinaryResponse: uploadResult,
            }
          );
        }
      } catch (error) {
        fileURL.convertedModelURL = '';
        fileURL.rawModelURL = '';
        fileURL.thumbnailImageURL = '';
        return await handleError(
          'OBJ_FILE_UPLOAD_ERROR',
          'Error occurred while uploading .obj file',
          {
            file: file.originalname,
            error: error instanceof Error ? error.message : 'Unknown upload error',
          }
        );
      }
    }

    try {
      const fileRes = await this.uploadToCloudinary(file, 'rawModels');
      if (fileRes.success) {
        response.file = true;
        uploadedFiles.push({
          public_id: (fileRes.result as { public_id: string }).public_id,
          folder: 'rawModels',
          resourceType: 'raw',
        });
        fileURL.rawModelURL = (fileRes.result as { secure_url: string }).secure_url;
      } else {
        fileURL.convertedModelURL = '';
        fileURL.rawModelURL = '';
        fileURL.thumbnailImageURL = '';
        return await handleError(
          'ORIGINAL_FILE_UPLOAD_FAILED',
          'Failed to upload original file to cloud storage',
          {
            file: file.originalname,
            cloudinaryResponse: fileRes,
          }
        );
      }
    } catch (error) {
      fileURL.convertedModelURL = '';
      fileURL.rawModelURL = '';
      fileURL.thumbnailImageURL = '';
      return await handleError(
        'ORIGINAL_FILE_UPLOAD_ERROR',
        'Error occurred while uploading original file',
        {
          file: file.originalname,
          error: error instanceof Error ? error.message : 'Unknown upload error',
        }
      );
    }
    try {
      const thumbnailRes = await this.uploadToCloudinary(thumbnailImage, 'thumbnail');
      if (thumbnailRes.success) {
        response.thumbnail = true;
        uploadedFiles.push({
          public_id: (thumbnailRes.result as { public_id: string }).public_id,
          folder: 'thumbnail',
          resourceType: 'image',
        });
        fileURL.thumbnailImageURL = (thumbnailRes.result as { secure_url: string }).secure_url;
      } else {
        fileURL.convertedModelURL = '';
        fileURL.rawModelURL = '';
        fileURL.thumbnailImageURL = '';
        return await handleError(
          'THUMBNAIL_UPLOAD_FAILED',
          'Failed to upload thumbnail image to cloud storage',
          {
            thumbnail: thumbnailImage.originalname,
            cloudinaryResponse: thumbnailRes,
          }
        );
      }
    } catch (error) {
      fileURL.convertedModelURL = '';
      fileURL.rawModelURL = '';
      fileURL.thumbnailImageURL = '';
      return await handleError(
        'THUMBNAIL_UPLOAD_ERROR',
        'Error occurred while uploading thumbnail',
        {
          thumbnail: thumbnailImage.originalname,
          error: error instanceof Error ? error.message : 'Unknown upload error',
        }
      );
    }

    return {
      URL: fileURL,
      response: response,
    };
  }

  async saveUploadToDatabase(uploadData: {
    thumbnailUrl: string;
    title: string;
    description: string;
    category: string;
    license: string;
    expiresIn: number;
    originalFileName: string;
    originalFileUrl: string;
    originalFileFormat: string;
    originalFileSize: number;
    convertedFileUrl: string;
    userIP: string;
  }) {
    try {
      const savedUpload = await this.prisma.createUpload(uploadData);
      return {
        success: true,
        uploadId: savedUpload.id,
        data: savedUpload,
      };
    } catch (error) {
      console.error('Failed to save upload to database:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database save failed',
      };
    }
  }

  async cleanupLocalFiles() {
    try {
      const convertedDir = StorageConfig.CONVERTED_TO_OBJ_PATH;
      if (fs.existsSync(convertedDir)) {
        const files = fs.readdirSync(convertedDir);
        for (const file of files) {
          const filePath = path.join(convertedDir, file);
          if (fs.statSync(filePath).isFile()) {
            await fs.promises.unlink(filePath);
            console.log(`Deleted converted file: ${filePath}`);
          }
        }
      }

      const thumbnailDir = StorageConfig.THUMBNAIL_PATH;
      if (fs.existsSync(thumbnailDir)) {
        const files = fs.readdirSync(thumbnailDir);
        for (const file of files) {
          const filePath = path.join(thumbnailDir, file);
          if (fs.statSync(filePath).isFile()) {
            await fs.promises.unlink(filePath);
            console.log(`Deleted thumbnail file: ${filePath}`);
          }
        }
      }

      const rawDir = StorageConfig.RAW_FILES_PATH;
      if (fs.existsSync(rawDir)) {
        const files = fs.readdirSync(rawDir);
        for (const file of files) {
          const filePath = path.join(rawDir, file);
          if (fs.statSync(filePath).isFile()) {
            await fs.promises.unlink(filePath);
            console.log(`Deleted raw file: ${filePath}`);
          }
        }
      }
    } catch (error) {
      console.error('Failed to cleanup local files:', error);
    }
  }
}
