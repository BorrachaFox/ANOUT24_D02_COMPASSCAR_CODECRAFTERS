import { Module } from '@nestjs/common';
import { PrismaModule } from "src/prisma/prisma.module";
import { CarsService } from "./cars.service";
import { CarsController } from "./cars.controller";

@Module({
  imports: [PrismaModule],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}