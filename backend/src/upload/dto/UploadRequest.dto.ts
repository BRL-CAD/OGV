export class UploadRequestDto {
  file: Express.Multer.File;
  thumbnailImage: Express.Multer.File;
  title: string;
  description: string;
  category: string;
  license: string;
  expiresIn: number;
  userIP: string;
}
