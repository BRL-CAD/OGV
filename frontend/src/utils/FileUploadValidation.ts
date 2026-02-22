import { FileInformationData } from '@/types/FileInformationData';
import { toast } from 'react-toastify';

export function validateFileInformation(
  fileInfo: FileInformationData
): boolean {
  const missingFields: string[] = [];

  if (!fileInfo.file) missingFields.push('File');
  if (!fileInfo.title) missingFields.push('Title');
  if (!fileInfo.description) missingFields.push('Description');
  if (!fileInfo.category) missingFields.push('Category');
  if (!fileInfo.license) missingFields.push('License');
  if (!fileInfo.expiresIn) missingFields.push('Expiry');
  if (!fileInfo.originalFileFormat) missingFields.push('Original Format');
  if (!fileInfo.fileSize) missingFields.push('File Size');
  if (!fileInfo.uploadDate) missingFields.push('Upload Date');

  if (missingFields.length > 0) {
    toast.error(`Missing required: ${missingFields.join(', ')}`);
    return false;
  }
  return true;
}
