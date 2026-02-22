import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConverterModule } from './converter/converter.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { StorageService } from './services/storage.service';
import { ModelModule } from './model/model.module';
import { ExpirationService } from './services/expiration.service';
import { ExpirationController } from './controllers/expiration.controller';

@Module({
  imports: [ScheduleModule.forRoot(), ConverterModule, PrismaModule, UploadModule, ModelModule],
  controllers: [AppController, ExpirationController],
  providers: [AppService, StorageService, ExpirationService],
})
export class AppModule {}
