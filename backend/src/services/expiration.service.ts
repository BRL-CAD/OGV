import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpirationService {
  private readonly logger = new Logger(ExpirationService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredModels() {
    try {
      this.logger.log('Starting expired models check...');

      const result = await this.prisma.updateExpiredModels();

      if (result.updatedCount > 0) {
        this.logger.log(`Updated ${result.updatedCount} models to expired status`);
      } else {
        this.logger.log('No models found to expire');
      }
    } catch (error) {
      this.logger.error('Error checking expired models:', error);
    }
  }
  async checkExpiredModels() {
    try {
      const result = await this.prisma.updateExpiredModels();
      return {
        success: true,
        updatedCount: result.updatedCount,
        message: `Updated ${result.updatedCount} models to expired status`,
      };
    } catch (error) {
      this.logger.error('Error checking expired models:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check expired models',
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
      this.logger.error('Error getting expired models:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get expired models',
      };
    }
  }
}
