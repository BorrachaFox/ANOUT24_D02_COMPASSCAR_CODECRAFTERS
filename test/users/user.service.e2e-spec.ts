import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Patch route', () => {
  let app: INestApplication;
  let mockPrismaService: any;

  beforeAll(async () => {
    mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('success', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id: 1,
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('@OldPass123', 10),
      status: 'active',
    });

    mockPrismaService.user.update.mockResolvedValueOnce({
      id: 1,
      name: 'user2',
      email: 'updated@gmail.com',
      password: await bcrypt.hash('@Qwerty1793', 10),
      status: 'active',
    });

    await request(app.getHttpServer())
      .patch('/users/1')
      .send({
        name: 'user2',
        email: 'updated@gmail.com',
        password: '@Qwerty1793',
      })
      .expect(200);
  });

  it('user not found', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

    await request(app.getHttpServer())
      .patch('/users/999')
      .send({
        name: 'user999',
      })
      .expect(404);
  });

  it('email in use', async () => {
    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id: 2,
      name: 'user2',
      email: 'existing@gmail.com',
      password: await bcrypt.hash('@OriginalPass456', 10),
      status: 'active',
    });

    await request(app.getHttpServer())
      .patch('/users/2')
      .send({
        email: 'existing@gmail.com',
      })
      .expect(409);
  });

  it('update with hashed pass', async () => {
    const newPassword = '@Qwerty9731';

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id: 2,
      name: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('@OldPass123', 10),
      status: 'active',
    });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    mockPrismaService.user.update.mockResolvedValueOnce({
      id: 2,
      name: 'user2',
      email: 'user2@example.com',
      password: hashedPassword,
      status: 'active',
    });

    await request(app.getHttpServer())
      .patch('/users/2')
      .send({
        name: 'user2',
        password: newPassword,
      })
      .expect(200);
  });
});
