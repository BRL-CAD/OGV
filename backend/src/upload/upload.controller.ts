import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadRequestDto } from './dto/UploadRequest.dto';
import { multerConfig } from './config/multer.config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FileURL } from 'src/types/FileURL';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  private async cleanupUploadedFiles(fileURL: FileURL) {
    try {
      if (fileURL.convertedModelURL) {
        await this.uploadService.deleteFromCloudinary(
          this.extractPublicId(fileURL.convertedModelURL),
          'convertedToObj',
          'raw'
        );
      }
      if (fileURL.rawModelURL) {
        await this.uploadService.deleteFromCloudinary(
          this.extractPublicId(fileURL.rawModelURL),
          'rawModels',
          'raw'
        );
      }
      if (fileURL.thumbnailImageURL) {
        await this.uploadService.deleteFromCloudinary(
          this.extractPublicId(fileURL.thumbnailImageURL),
          'thumbnail',
          'image'
        );
      }

      await this.uploadService.cleanupLocalFiles();
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Failed to cleanup uploaded files',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }

  @Post('model')
  @UseGuards(ThrottlerGuard)
  @UseInterceptors(AnyFilesInterceptor(multerConfig))
  async uploadModel(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: Omit<UploadRequestDto, 'file' | 'thumbnailImage'>
  ) {
    const fileFormat = files[0].originalname.split('.').pop();
    const file = files.find((f) => f.fieldname === 'file');
    const thumbnailImage = files.find((f) => f.fieldname === 'thumbnailImage');

    if (!file || !thumbnailImage) {
      throw new HttpException(
        {
          success: false,
          error: 'Both file and thumbnail image are required',
          debug: {
            totalFiles: files.length,
            availableFieldnames: files.map((f) => f.fieldname),
            fileFound: !!file,
            thumbnailFound: !!thumbnailImage,
          },
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const request: UploadRequestDto = {
      ...body,
      file,
      thumbnailImage,
    };
    const fileURL: FileURL = {
      rawModelURL: '',
      convertedModelURL: '',
      thumbnailImageURL: '',
    };

    const validationResult = this.uploadService.validateRequest(request);
    if (!validationResult.success) {
      throw new HttpException(
        {
          success: false,
          error: 'message' in validationResult ? validationResult.message : 'Validation failed',
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const result = await this.uploadService.processUploadWithCleanup(file, thumbnailImage, fileURL);

    if (
      'URL' in result &&
      result.URL &&
      result.URL.convertedModelURL &&
      result.URL.rawModelURL &&
      result.URL.thumbnailImageURL &&
      fileFormat
    ) {
      const uploadData = {
        thumbnailUrl: result.URL.thumbnailImageURL,
        title: request.title,
        description: request.description,
        category: request.category,
        license: request.license,
        expiresIn: parseInt(request.expiresIn.toString(), 10),
        originalFileName: file.originalname,
        originalFileUrl: result.URL.rawModelURL,
        originalFileFormat: fileFormat,
        originalFileSize: parseInt(file.size.toString(), 10),
        convertedFileUrl: result.URL.convertedModelURL,
        userIP: request.userIP,
        status: 'active',
      };

      try {
        const saveResult = await this.uploadService.saveUploadToDatabase(uploadData);
        if (saveResult.success) {
          return {
            success: true,
            uploadId: saveResult.uploadId,
            data: saveResult.data,
          };
        } else {
          await this.cleanupUploadedFiles(result.URL);
          throw new HttpException(
            {
              success: false,
              error: 'Upload successful but failed to save to database',
              databaseError: saveResult.error,
            },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      } catch (saveError) {
        await this.cleanupUploadedFiles(result.URL);
        throw new HttpException(
          {
            success: false,
            error: 'Database error occurred',
            details: saveError instanceof Error ? saveError.message : 'Unknown database error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } else {
      if ('URL' in result && result.URL) {
        await this.cleanupUploadedFiles(result.URL);
      }
      throw new HttpException(
        {
          success: false,
          error: 'Failed to process upload',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
