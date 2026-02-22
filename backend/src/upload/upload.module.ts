import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConverterModule } from 'src/converter/converter.module';

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 600000, limit: 100 }],
    }),
    ConverterModule,
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
