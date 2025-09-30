import { Module } from '@nestjs/common';
import { TodoController } from '../controller/todo.controller';
import { TodoService } from '../service/todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from '../schema/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
