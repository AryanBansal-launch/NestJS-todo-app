import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { TodoService } from '../service/todo.service';
import { CreateTodoDto } from '../dto/CreateTodoDTO/create-todo.dto';
import { UpdateTodoDto } from '../dto/UpdateTodoDTO/update-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('health')
  getHealth(): string {
    return this.todoService.getHealth();
  }

  @Post()
  async createTodo(@Body() todoBody: CreateTodoDto) {
    return await this.todoService.createTodo(todoBody);
  }
  @Get()
  async getAllTodos(@Query('status') status?: string) {
    return await this.todoService.getAllTodos(status);
  }

  @Get(':id')
  async getTodoById(@Param('id') id: string) {
    return await this.todoService.getTodoById(id);
  }

  @Put(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updatedbody: UpdateTodoDto,
  ) {
    return await this.todoService.updateTodo(id, updatedbody);
  }

  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    return await this.todoService.deleteTodo(id);
  }
}
