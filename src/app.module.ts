import { App } from 'supertest/types';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads environment variables
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app'), TodoModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
