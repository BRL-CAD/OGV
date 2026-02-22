import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { StorageConfig } from '../config/storage.config';

@Injectable()
export class StorageService implements OnModuleInit {
  onModuleInit() {
    this.createDirectories();
  }

  private createDirectories() {
    const directories = [
      StorageConfig.UPLOAD_BASE_PATH,
      StorageConfig.UPLOAD_API_PATH,
      StorageConfig.RAW_FILES_PATH,
      StorageConfig.CONVERTED_TO_OBJ_PATH,
      StorageConfig.THUMBNAIL_PATH,
      StorageConfig.CONVERSION_API_PATH,
      StorageConfig.CONVERTER_INPUT_PATH,
      StorageConfig.CONVERTER_OUTPUT_PATH,
      StorageConfig.TEMP_FILES_PATH,
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    }
  }
}
