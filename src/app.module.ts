import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';
import { ClientModule } from './client/client.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot(), ClientModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
