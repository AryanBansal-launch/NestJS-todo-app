import { Controller, Query } from '@nestjs/common';
import { TodoService } from '../service/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { stat } from 'fs';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // REST GET call on /todos get all todos
  @Get()
  async getAllTodos(@Query('status') status?: string) {
    return await this.todoService.getAll(status);
  }

  //REST GET call on /todos/id get todo by id
  @Get(':id')
  async getTodoById(@Param('id') id: String) {
      const todo = await this.todoService.getById(id);
      return todo;
  }

  //REST POST create call on /todos create todo
  @Post()
  async createTodo(@Body() todobody: CreateTodoDto) {
    const todo = await this.todoService.create(todobody.title);
    return todo;
  }

  //REST PUT update call on /todos/id update by id
  @Put(':id')
  async updateTodo(@Param('id') id: String, @Body() todobody: UpdateTodoDto) {
      const updatedtodo = await this.todoService.update(
        id,
        todobody.completed ?? false,
      );
      return updatedtodo;
  }

  //REST DELETE delete call on /todos/id delete todo by Id
  @Delete(':id')
  async deleteTodo(@Param('id') id: String) {
      const deletedTodo = await this.todoService.delete(id);
      return deletedTodo;
  }
}