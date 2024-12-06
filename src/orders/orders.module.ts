import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders-service';
import { ClientsModule } from '../clients/clients.module';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [PrismaModule, ClientsModule, CarsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
