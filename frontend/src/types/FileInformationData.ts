export type FileInformationData = {
  file: File | null;
  title: string;
  description: string;
  category: string;
  thumbnail: File | null;
  license: string;
  expiresIn: number;
  originalFileFormat: string;
  fileSize: string;
  uploadDate: string;
};
