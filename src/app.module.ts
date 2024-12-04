import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot(), ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
