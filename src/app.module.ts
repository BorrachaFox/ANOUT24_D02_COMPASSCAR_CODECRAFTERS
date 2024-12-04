import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './clients/clients.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    ClientsModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
