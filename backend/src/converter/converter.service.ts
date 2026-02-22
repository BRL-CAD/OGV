import { Injectable } from '@nestjs/common';
import { ConvertFile, FileRequest, ConversionFileResult } from 'ogv-conversation-package';
import { StorageConfig } from 'src/config/storage.config';

@Injectable()
export class ConverterService {
  async convertToMultipleFormats(
    file: Express.Multer.File,
    outputFormats: string[]
  ): Promise<ConversionFileResult> {
    const fileRequest: FileRequest = {
      filePath: file.path,
      fileName: file.originalname,
      outputFormat: outputFormats,
      outputPath: StorageConfig.CONVERTER_OUTPUT_PATH,
    };

    const result = await ConvertFile(fileRequest);
    if (!result) {
      throw new Error('Conversion failed');
    }
    return result;
  }
}
