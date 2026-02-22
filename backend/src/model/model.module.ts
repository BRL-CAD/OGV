import { Module } from '@nestjs/common';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ModelController],
  providers: [ModelService],
  imports: [PrismaModule],
})
export class ModelModule {}
