import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UploadModel } from '@prisma/client';

type UploadModelWithoutIP = Omit<UploadModel, 'userIP'>;

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async getAllUploads(): Promise<UploadModelWithoutIP[]> {
    return this.uploadModel.findMany({
      select: {
        id: true,
        thumbnailUrl: true,
        title: true,
        description: true,
        category: true,
        license: true,
        createdAt: true,
        status: true,
        expiresIn: true,
        originalFileName: true,
        originalFileUrl: true,
        originalFileFormat: true,
        originalFileSize: true,
        convertedFileUrl: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUploadById(id: string): Promise<UploadModelWithoutIP | null> {
    return this.uploadModel.findUnique({
      where: { id },
      select: {
        id: true,
        thumbnailUrl: true,
        title: true,
        description: true,
        category: true,
        license: true,
        createdAt: true,
        status: true,
        expiresIn: true,
        originalFileName: true,
        originalFileUrl: true,
        originalFileFormat: true,
        originalFileSize: true,
        convertedFileUrl: true,
      },
    });
  }

  async createUpload(data: {
    thumbnailUrl: string;
    title: string;
    description: string;
    category: string;
    license: string;
    expiresIn: number;
    originalFileName: string;
    originalFileUrl: string;
    originalFileFormat: string;
    originalFileSize: number;
    convertedFileUrl: string;
    userIP: string;
  }): Promise<UploadModel> {
    return this.uploadModel.create({
      data,
    });
  }

  async updateExpiredModels(): Promise<{ updatedCount: number }> {
    const models = await this.uploadModel.findMany({
      where: {
        status: 'active',
      },
    });

    const now = new Date();
    const expiredModelIds = models
      .filter((model) => {
        const expirationTime = new Date(
          model.createdAt.getTime() + model.expiresIn * 60 * 60 * 1000
        );
        return now >= expirationTime;
      })
      .map((model) => model.id);

    if (expiredModelIds.length === 0) {
      return { updatedCount: 0 };
    }

    const result = await this.uploadModel.updateMany({
      where: {
        id: {
          in: expiredModelIds,
        },
      },
      data: {
        status: 'expired',
      },
    });

    return { updatedCount: result.count };
  }

  async getExpiredModels(): Promise<UploadModelWithoutIP[]> {
    const now = new Date();
    const models = await this.uploadModel.findMany({
      where: {
        status: 'active',
      },
      select: {
        id: true,
        thumbnailUrl: true,
        title: true,
        description: true,
        category: true,
        license: true,
        createdAt: true,
        status: true,
        expiresIn: true,
        originalFileName: true,
        originalFileUrl: true,
        originalFileFormat: true,
        originalFileSize: true,
        convertedFileUrl: true,
      },
    });
    const expiredModels = models.filter((model) => {
      const expirationTime = new Date(model.createdAt.getTime() + model.expiresIn * 60 * 60 * 1000);
      return now >= expirationTime;
    });

    return expiredModels;
  }
}
