import { diskStorage, FileFilterCallback } from 'multer';
import { InputFormats } from '../../constants';
import { StorageConfig } from 'src/config/storage.config';

export const multerConfig = {
  storage: diskStorage({
    destination: StorageConfig.CONVERTER_INPUT_PATH,
    filename: (req, file, callback) => {
      const filename = `${file.originalname}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const ext: string = file.originalname.split('.').pop()?.toLowerCase() || '';
    const isValid = InputFormats.includes(ext);

    if (!isValid) {
      return callback(null, false);
    }

    callback(null, true);
  },
};
