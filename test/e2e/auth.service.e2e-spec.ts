import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AuthService', () => {
  let prisma: PrismaService;
  let app: INestApplication;
  let authService: AuthService;

  const data = {
    name: 'test',
    email: 'test@email.com',
    password: 's2@Dd685ads56sd48',
  };

  const dataRegister = {
    name: 'test1',
    email: 'test1@email.com',
    password: 'ssd2@Dd685ads56sd48',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    authService = module.get<AuthService>(AuthService);

    prisma = module.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - Deve registrar um usuário com credenciais válidas', async () => {
    await prisma.user.deleteMany({ where: { email: data.email } });
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(data);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });

  it('/auth/login (POST) - Deve autenticar um usuário registrado e retornar um JWT', async () => {
    await prisma.user.deleteMany({ where: { email: data.email } });
    await authService.register(data);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: dataRegister.email,
        password: dataRegister.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(typeof response.body.accessToken).toBe('string');
  });
});
