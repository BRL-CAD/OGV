export interface ModelData {
  id: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  category: string;
  license: string;
  createdAt: string;
  status: string;
  expiresIn: number;
  originalFileName: string;
  originalFileUrl: string;
  originalFileFormat: string;
  originalFileSize: number;
  convertedFileUrl: string;
}
export interface ModelsApiResponse {
  success: boolean;
  data: ModelData[];
  count: number;
}
