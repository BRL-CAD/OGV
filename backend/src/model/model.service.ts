import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ModelService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllUploads() {
    try {
      const uploads = await this.prisma.getAllUploads();
      const activeUploads = uploads.filter((upload) => upload.status === 'active');
      return {
        success: true,
        data: activeUploads,
        count: activeUploads.length,
      };
    } catch (error) {
      console.error('Failed to get uploads from database:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve uploads',
      };
    }
  }
  async getUploadById(id: string) {
    try {
      const upload = await this.prisma.getUploadById(id);
      if (upload && upload.status === 'active') {
        return {
          success: true,
          data: upload,
        };
      }
      if (!upload) {
        return {
          success: false,
          error: 'Upload not found',
        };
      }
    } catch (error) {
      console.error('Failed to get upload by ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve upload',
      };
    }
  }

  async getExpiredModels() {
    try {
      const expiredModels = await this.prisma.getExpiredModels();
      return {
        success: true,
        data: expiredModels,
        count: expiredModels.length,
      };
    } catch (error) {
      console.error('Failed to get expired models:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve expired models',
      };
    }
  }
}
