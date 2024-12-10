import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from '../../src/cars/cars.controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthController } from '../../src/auth/auth.controller';

describe('CarsController (e2e)', () => {
  let prisma: PrismaService;
  let app: INestApplication;
  let carsController: CarsController;
  let authController: AuthController;

  let jwtToken: string;

  const testUser = {
    name: 'test user',
    email: 'user@test.com',
    password: 'password123',
  };

  const testData = {
    brand: 'test',
    model: 'test',
    plate: 'TST-9J98',
    year: 2024,
    km: 5841,
    daily_rate: 230,
    items: ['Item 1', 'Item 2'],
  };

  let createdCarId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    carsController = module.get<CarsController>(CarsController);
    authController = module.get<AuthController>(AuthController);

    prisma = module.get<PrismaService>(PrismaService);

    const authResponse = await authController.register(testUser);

    jwtToken = authResponse.accessToken;

    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.car.deleteMany({ where: { plate: testData.plate } });

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.car.deleteMany({ where: { plate: testData.plate } });
    await app.close();
  });

  it('/cars (POST) - Should create a car when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post('/cars')
      .send(testData)
      .set('Authorization', `Bearer ${jwtToken}`);

    createdCarId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(testData));
    expect(response.body).toHaveProperty('status', 'ACTIVE');
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toHaveProperty('update_at');

    const createdCar = await prisma.car.findFirst({
      where: { plate: testData.plate },
    });

    expect(createdCar).not.toBeNull();
    expect(createdCar).toEqual(expect.objectContaining(testData));
  });

  it('/cars (GET) - Should return a list of cars', async () => {
    const response = await request(app.getHttpServer())
      .get('/cars')
      .send(testData)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    expect(response.body[0]).toHaveProperty('brand');
    expect(response.body[0]).toHaveProperty('model');
    expect(response.body[0]).toHaveProperty('plate');
    expect(response.body[0]).toHaveProperty('year');
  });

  it('/cars/:id (GET) - Should return a car by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cars/${createdCarId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdCarId);
    expect(response.body).toHaveProperty('brand', testData.brand);
    expect(response.body).toHaveProperty('model', testData.model);
    expect(response.body).toHaveProperty('plate', testData.plate);
    expect(response.body).toHaveProperty('year', testData.year);
  });

  it('/cars/:id (PATCH) - Should edit a car by ID', async () => {
    const updateData = {
      brand: 'updated brand',
      model: 'updated model',
      km: 6000,
    };

    const response = await request(app.getHttpServer())
      .patch(`/cars/${createdCarId}`)
      .send(updateData)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: createdCarId,
        ...updateData,
      }),
    );

    const updatedCar = await prisma.car.findUnique({
      where: { id: createdCarId },
    });

    expect(updatedCar).not.toBeNull();
    expect(updatedCar).toEqual(expect.objectContaining(updateData));
  });

  it('/cars/:id (DELETE) - Should delete a car by ID', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/cars/${createdCarId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(204);

    const deletedCar = await prisma.car.findUnique({
      where: { id: createdCarId },
    });

    expect(deletedCar.status).toBe('INACTIVE');
  });
});
