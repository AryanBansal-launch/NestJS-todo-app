import { App } from 'supertest/types';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/module/todo.module';
import envConfig from './config/env.config';
import { ConfigService } from '@nestjs/config';
import { TodoService } from './todo/service/todo.service';
import { TodoController } from './todo/controller/todo.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database', ' '),
      }),
      inject: [ConfigService],
    }),
    TodoModule,
  ],
  controllers: [AppController, TodoController],
  providers: [AppService, TodoService],
})
export class AppModule {}
