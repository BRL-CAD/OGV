export interface ConversionFile {
  format: string;
  path: string;
  filename: string;
}

export interface ConversionResponseDto {
  success: boolean;
  files: ConversionFile[];
  zipPath?: string;
  message?: string;
}
