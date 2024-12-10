import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders-service';
import { ClientsModule } from '../clients/clients.module';
import { CarsModule } from '../cars/cars.module';
import { AuthModule } from '../auth/auth.module';
import { IsAuthGuard } from '../guards/auth/isAuth.guards';

@Module({
  imports: [PrismaModule, ClientsModule, CarsModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService, IsAuthGuard],
  exports: [OrdersService],
})
export class OrdersModule {}
