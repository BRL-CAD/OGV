export const FileSize = (fileSize: string) => {
  if (fileSize) {
    const bytes = parseInt(fileSize, 10);

    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const sizeInUnit = bytes / Math.pow(k, i);
    const roundedSize = Math.round(sizeInUnit * 10) / 10;

    return `${roundedSize} ${sizes[i]}`;
  }
  return 'File Not Found';
};
