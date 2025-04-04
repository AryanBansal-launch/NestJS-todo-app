import { Module } from '@nestjs/common';
import { TodoService } from '../service/todo.service';
import { TodoController } from '../controllers/todo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo } from '../schema/todo.schema';
import { TodoSchema } from '../schema/todo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
