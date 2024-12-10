import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
