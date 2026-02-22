export interface UploadedFile {
  public_id: string;
  folder: string;
  resourceType: 'raw' | 'image' | 'video';
}
