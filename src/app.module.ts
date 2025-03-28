import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads environment variables
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app'), // Uses the MongoDB URL from .env or a default value
    TodoModule,
  ],
})
export class AppModule {}
