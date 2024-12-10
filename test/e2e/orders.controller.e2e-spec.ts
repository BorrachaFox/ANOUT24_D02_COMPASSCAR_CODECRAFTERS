import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../src/orders/orders.controller';
import { ClientsController } from '../../src/clients/clients.controller';
import { CarsController } from '../../src/cars/cars.controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthController } from '../../src/auth/auth.controller';

describe('OrdersController (e2e)', () => {
  let prisma: PrismaService;
  let app: INestApplication;
  let ordersController: OrdersController;
  let carsController: CarsController;
  let clientsController: ClientsController;
  let authController: AuthController;

  let jwtToken: string;

  const testUser = {
    name: 'test user',
    email: 'user@test.com',
    password: 'password123',
  };

  const testClient = {
    name: 'test user',
    cpf: '672.512.820-38',
    email: 'testemail@gmail.com',
    birthday: '1990-05-19',
    phone: '558836550897',
  };

  const testCar = {
    brand: 'test',
    model: 'test',
    plate: 'TST-0J08',
    year: 2024,
    km: 5841,
    daily_rate: 230,
    items: ['Item 1', 'Item 2'],
  };

  const testOrder = {
    client_id: 1,
    car_id: 1,
    start_date: '2024-12-09',
    final_date: '2024-12-20',
    cep: '01001000',
  };

  let createdOrderId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    ordersController = module.get<OrdersController>(OrdersController);
    clientsController = module.get<ClientsController>(ClientsController);
    carsController = module.get<CarsController>(CarsController);
    authController = module.get<AuthController>(AuthController);

    prisma = module.get<PrismaService>(PrismaService);

    const authResponse = await authController.register(testUser);
    jwtToken = authResponse.accessToken;

    testOrder.client_id = (await clientsController.create(testClient)).id;
    testOrder.car_id = (await carsController.create(testCar)).id;

    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.client.deleteMany({ where: { cpf: testClient.cpf } });
    await prisma.car.deleteMany({ where: { plate: testCar.plate } });
    await prisma.order.deleteMany({
      where: { client_id: testOrder.client_id },
    });

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.client.deleteMany({ where: { cpf: testClient.cpf } });
    await prisma.car.deleteMany({ where: { plate: testCar.plate } });
    await prisma.order.deleteMany({
      where: { client_id: testOrder.client_id },
    });
    await app.close();
  });

  it('/orders (POST) - Should create an order when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(testOrder)
      .set('Authorization', `Bearer ${jwtToken}`);

    createdOrderId = response.body.id;

    expect(response.status).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: createdOrderId,
        client_id: testOrder.client_id,
        car_id: testOrder.car_id,
        cep: testOrder.cep,
        start_date: testOrder.start_date,
        final_date: testOrder.final_date,
      }),
    );

    expect(response.body).toHaveProperty('status', 'OPEN');
    expect(response.body).toHaveProperty('rental_fee');
    expect(response.body).toHaveProperty('total_rental_price');
    expect(response.body).toHaveProperty('created_at');

    const createdOrder = await prisma.order.findUnique({
      where: { id: createdOrderId },
    });

    expect(createdOrder).not.toBeNull();
    expect(createdOrder).toEqual(
      expect.objectContaining({
        client_id: testOrder.client_id,
        car_id: testOrder.car_id,
        status: 'OPEN',
      }),
    );
  });

  it('/orders (GET) - Should return a list of orders', async () => {
    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('client_id');
    expect(response.body[0]).toHaveProperty('car_id');
    expect(response.body[0]).toHaveProperty('start_date');
    expect(response.body[0]).toHaveProperty('final_date');
    expect(response.body[0]).toHaveProperty('status');
    expect(response.body[0]).toHaveProperty('total_rental_price');
  });

  it('/orders/:id (GET) - Should return an order by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: createdOrderId,
        client_id: testOrder.client_id,
        car_id: testOrder.car_id,
        cep: testOrder.cep,
        start_date: testOrder.start_date,
        final_date: testOrder.final_date,
      }),
    );

    expect(response.body).toHaveProperty('status', 'OPEN');
    expect(response.body).toHaveProperty('rental_fee');
    expect(response.body).toHaveProperty('total_rental_price');
    expect(response.body).toHaveProperty('created_at');
  });

  it('/orders/:id (PATCH) - Should edit an order by ID', async () => {
    const updateData = {
      start_date: '2024-12-09',
      final_date: '2025-12-12',
      cep: '11801-000',
    };

    const response = await request(app.getHttpServer())
      .patch(`/orders/${createdOrderId}`)
      .send(updateData)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: createdOrderId,
        cep: updateData.cep,
        start_date: updateData.start_date,
        final_date: updateData.final_date,
      }),
    );

    const updatedOrder = await prisma.order.findUnique({
      where: { id: createdOrderId },
    });

    expect(updatedOrder).not.toBeNull();
    expect(updatedOrder).toEqual(
      expect.objectContaining({
        start_date: updateData.start_date,
        final_date: updateData.final_date,
        cep: updateData.cep,
      }),
    );
  });

  it('/orders/:id (DELETE) - Should delete a order by ID', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(204);

    const deletedOrder = await prisma.user.findUnique({
      where: { id: createdOrderId },
    });

    expect(deletedOrder.status).toBe('INACTIVE');
  });
});
