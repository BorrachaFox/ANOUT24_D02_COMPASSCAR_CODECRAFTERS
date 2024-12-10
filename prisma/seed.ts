import { NestFactory } from '@nestjs/core';
import { UsersService } from '../src/users/users.service';
import { ClientsService } from '../src/clients/clients.service';
import { OrdersService } from '../src/orders/orders-service';
import { CarsService } from '../src/cars/cars.service';
import { BadRequestException, Logger } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as bcrypt from 'bcrypt';
import { CreateClientDto } from '../src/clients/dto/create-client.dto';
import { CreateCarDTO } from '../src/cars/dto/create-car.dto';
import { CreateOrdersDto } from '../src/orders/dto/create-order.dto';
import { CreateUserDTO } from '../src/users/dto/create-user.dto';

async function seeds() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UsersService);
  const clientService = app.get(ClientsService);
  const orderService = app.get(OrdersService);
  const carService = app.get(CarsService);

  try {
    const userSeed: CreateUserDTO = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'abcd123456'
    };
    await userService.create(userSeed);
    Logger.log('User seeded successfully.');
  } catch (error) {
    throw new BadRequestException(error);
    Logger.error('Error while creating user seed');
  }

  try {
    const clientSeed: CreateClientDto = {
      name: 'Hilda D. Isaacs',
      cpf: '12345678900',
      email: 'hilda@email.com',
      phone: '19911012345',
      birthday: '1990-01-01',
      status: 'ACTIVE'
    };
    await clientService.create(clientSeed);
    Logger.log('Client seeded successfully.');
  } catch (error) {
    throw new BadRequestException(error);
    Logger.error('Error while creating client seed');
  }

  try {
    const carSeed: CreateCarDTO = {
      brand: 'Audi',
      model: 'TT',
      plate: 'BRA-2E24',
      year: new Date().getFullYear(),
      daily_rate: 50,
      items: ['Teto Solar Paranoramico ', 'Sensor de presença'],
      km: 20.0,
    };
    await carService.create(carSeed);
    Logger.log('Car seeded successfully.');
  } catch (error) {
    throw new BadRequestException(error);
    Logger.error('Error while creating car seed');
  }

  try {
    const orderSeed: CreateOrdersDto = {
      car_id: 1,
      client_id: 1,
      start_date: new Date().toISOString(),
      final_date: new Date().toISOString(),
      cep: '01001000',
    };
    await orderService.create(orderSeed);
    Logger.log('Order seeded successfully.');
  } catch (error) {
    throw new BadRequestException(error);
    Logger.error('Error while creating order seed');
  }
  app.close();
}

seeds();
