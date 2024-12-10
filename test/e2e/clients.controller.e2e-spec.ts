import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../../src/clients/clients.controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthController } from '../../src/auth/auth.controller';

describe('ClientsController (e2e)', () => {
  let prisma: PrismaService;
  let app: INestApplication;
  let clientsController: ClientsController;
  let authController: AuthController;

  let jwtToken: string;

  const testUser = {
    name: 'test sauser',
    email: 'usasdaer@test.com',
    password: 'password123',
  };

  const testData = {
    name: 'test user',
    cpf: '672.512.820-38',
    email: 'testemail@gmail.com',
    birthday: '1990-05-19',
    phone: '558836550897',
  };

  let createdClientId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    clientsController = module.get<ClientsController>(ClientsController);
    authController = module.get<AuthController>(AuthController);

    prisma = module.get<PrismaService>(PrismaService);

    const authResponse = await authController.register(testUser);
    jwtToken = authResponse.accessToken;

    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.client.deleteMany({ where: { cpf: testData.cpf } });

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.client.deleteMany({ where: { cpf: testData.cpf } });

    await app.close();
  });

  it('/clients (POST) - Should create a client when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post('/clients')
      .send(testData)
      .set('Authorization', `Bearer ${jwtToken}`);

    createdClientId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body.name).toEqual(testData.name);
    expect(response.body.cpf).toEqual(testData.cpf);
    expect(response.body.email).toEqual(testData.email);
    expect(response.body.phone).toEqual(testData.phone);
    expect(response.body).toHaveProperty('status', 'ACTIVE');
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toHaveProperty('update_at');

    const createdClient = await prisma.client.findUnique({
      where: { id: createdClientId },
    });

    expect(createdClient).not.toBeNull();
    expect(createdClient).toEqual(
      expect.objectContaining({
        name: testData.name,
        cpf: testData.cpf,
        email: testData.email,
        phone: testData.phone,
      }),
    );
  });

  it('/clients (GET) - Should return a list of clients', async () => {
    const response = await request(app.getHttpServer())
      .get('/clients')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data.length).toBeGreaterThan(0);

    expect(response.body.data[0]).toHaveProperty('name');
    expect(response.body.data[0]).toHaveProperty('cpf');
    expect(response.body.data[0]).toHaveProperty('email');
    expect(response.body.data[0]).toHaveProperty('birthday');
    expect(response.body.data[0]).toHaveProperty('phone');
  });

  it('/clients/:id (GET) - Should return a client by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdClientId);
    expect(response.body).toHaveProperty('name', testData.name);
    expect(response.body).toHaveProperty('cpf', testData.cpf);
    expect(response.body).toHaveProperty('email', testData.email);
  });

  it('/clients/:id (PATCH) - Should edit a client by ID', async () => {
    const updateData = {
      name: 'Updated Client',
      phone: '558899999999',
    };

    const response = await request(app.getHttpServer())
      .patch(`/clients/${createdClientId}`)
      .send(updateData)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: createdClientId,
        ...updateData,
      }),
    );

    const updatedClient = await prisma.client.findUnique({
      where: { id: createdClientId },
    });

    expect(updatedClient).not.toBeNull();
    expect(updatedClient).toEqual(expect.objectContaining(updateData));
  });

  it('/clients/:id (DELETE) - Should delete a clients by ID', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(204);

    const deletedClient = await prisma.client.findUnique({
      where: { id: createdClientId },
    });

    expect(deletedClient.status).toBe('INACTIVE');
  });
});
