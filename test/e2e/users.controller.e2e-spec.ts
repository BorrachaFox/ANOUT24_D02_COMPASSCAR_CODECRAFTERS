import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthController } from '../../src/auth/auth.controller';

describe('UsersController (e2e)', () => {
  let prisma: PrismaService;
  let app: INestApplication;
  let usersController: UsersController;
  let authController: AuthController;

  let jwtToken: string;

  const testUser = {
    name: 'test user',
    email: 'u1548ser@test.com',
    password: 'password123',
  };

  const testData = {
    name: 'New User',
    email: 'newuser@test.com',
    password: 'newpassword123',
  };

  let createdUserId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersController = module.get<UsersController>(UsersController);
    authController = module.get<AuthController>(AuthController);

    prisma = module.get<PrismaService>(PrismaService);

    const authResponse = await authController.register(testUser);
    jwtToken = authResponse.accessToken;

    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.user.deleteMany({ where: { email: testData.email } });

    await app.init();
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.user.deleteMany({ where: { email: testData.email } });
    await app.close();
  });

  it('/users (POST) - Should create a user when authenticated', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(testData)
      .set('Authorization', `Bearer ${jwtToken}`);

    createdUserId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: testData.name,
        email: testData.email,
      }),
    );

    expect(response.body).toHaveProperty('status', 'ACTIVE');
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toHaveProperty('update_at');

    const createdUser = await prisma.user.findUnique({
      where: { id: createdUserId },
    });

    expect(createdUser).not.toBeNull();
    expect(createdUser).toEqual(
      expect.objectContaining({
        name: testData.name,
        email: testData.email,
      }),
    );
  });

  it('/users (GET) - Should return a list of users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.data.length).toBeGreaterThan(0);

    expect(response.body.data[0]).toHaveProperty('name');
    expect(response.body.data[0]).toHaveProperty('email');
  });

  it('/users/:id (GET) - Should return a user by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdUserId);
    expect(response.body).toHaveProperty('name', testData.name);
    expect(response.body).toHaveProperty('email', testData.email);
  });

  it('/users/:id (PATCH) - Should edit a user by ID', async () => {
    const updateData = {
      name: 'Updated User',
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .send(updateData)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: createdUserId,
        name: updateData.name,
      }),
    );

    const updatedUser = await prisma.user.findUnique({
      where: { id: createdUserId },
    });

    expect(updatedUser).not.toBeNull();
    expect(updatedUser).toEqual(expect.objectContaining(updateData));
  });

  it('/users/:id (DELETE) - Should delete a user by ID', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.status).toBe(204);

    const deletedUser = await prisma.user.findUnique({
      where: { id: createdUserId },
    });

    expect(deletedUser.status).toBe('INACTIVE');
  });
});
