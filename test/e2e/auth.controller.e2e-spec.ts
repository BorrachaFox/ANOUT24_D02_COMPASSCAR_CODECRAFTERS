import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let prisma: PrismaService;
  let app: INestApplication;
  let authController: AuthController;

  const testData = {
    name: 'test',
    email: 'test@email.com',
    password: '123456789',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    authController = module.get<AuthController>(AuthController);

    prisma = module.get<PrismaService>(PrismaService);

    await prisma.order.deleteMany();
    await prisma.car.deleteMany();
    await prisma.client.deleteMany();
    await prisma.user.deleteMany();

    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: testData.email } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testData.email } });
    await app.close();
  });

  it('/auth/register (POST) - Should register a user with valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');

    const createdUser = await prisma.user.findFirst({
      where: { email: testData.email },
    });

    expect(createdUser).not.toBeNull();
    expect(createdUser?.email).toBe(testData.email);
    expect(createdUser?.name).toBe(testData.name);
  });

  it('/auth/login (POST) - Should authenticate a registered user and return a JWT', async () => {
    await authController.register(testData);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testData.email,
        password: testData.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('/auth/login (POST) - Should return an error when trying to authenticate with an incorrect password', async () => {
    await authController.register(testData);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testData.email,
        password: 'Wr0ngP@ssword213456',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Email or password may be incorrect');
  });
});
