import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ModelService } from './model.service';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Get()
  async getAllUploads() {
    const result = await this.modelService.getAllUploads();
    if (!result.success) {
      throw new HttpException(
        {
          success: false,
          error: result.error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }

  @Get(':id')
  async getUploadById(@Param('id') id: string) {
    const result = await this.modelService.getUploadById(id);
    if (result && !result.success) {
      if (result.error === 'Upload not found') {
        throw new HttpException(
          {
            success: false,
            error: result.error,
          },
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        {
          success: false,
          error: result.error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }

  @Get('expired')
  async getExpiredModels() {
    const result = await this.modelService.getExpiredModels();
    if (!result.success) {
      throw new HttpException(
        {
          success: false,
          error: result.error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }
}
