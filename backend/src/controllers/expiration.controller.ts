import { Controller, Get, Post } from '@nestjs/common';
import { ExpirationService } from '../services/expiration.service';

@Controller('expiration')
export class ExpirationController {
  constructor(private readonly expirationService: ExpirationService) {}

  @Post('check')
  async checkExpiredModels() {
    return this.expirationService.checkExpiredModels();
  }

  @Get('expired')
  async getExpiredModels() {
    return this.expirationService.getExpiredModels();
  }
}
