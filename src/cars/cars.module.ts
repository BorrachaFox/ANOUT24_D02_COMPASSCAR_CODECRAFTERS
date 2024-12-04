import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  imports: [PrismaModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
