export const StorageConfig = {
  UPLOAD_BASE_PATH: process.env.UPLOAD_BASE_PATH || './uploads',

  // Upload API paths
  UPLOAD_API_PATH: process.env.UPLOAD_API_PATH || './uploads/upload-api',
  RAW_FILES_PATH: process.env.RAW_FILES_PATH || './uploads/upload-api/raw',
  CONVERTED_TO_OBJ_PATH:
    process.env.CONVERTED_TO_OBJ_PATH || './uploads/upload-api/converted-to-obj',
  THUMBNAIL_PATH: process.env.THUMBNAIL_PATH || './uploads/upload-api/thumbnails',

  // Conversion API paths
  CONVERSION_API_PATH: process.env.CONVERSION_API_PATH || './uploads/conversion-api',
  CONVERTER_INPUT_PATH: process.env.CONVERTER_INPUT_PATH || './uploads/conversion-api/inputs',
  CONVERTER_OUTPUT_PATH: process.env.CONVERTER_OUTPUT_PATH || './uploads/conversion-api/outputs',

  // Temp files path
  TEMP_FILES_PATH: process.env.TEMP_FILES_PATH || './uploads/temp',
};
