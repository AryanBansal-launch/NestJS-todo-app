import { Controller } from '@nestjs/common';
import { TodoService } from '../service/todo.service';
import { Todo } from '../schema/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import {
  Body,
  Param,
  Query,
} from '@nestjs/common/decorators/http/route-params.decorator';
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  //Route to create a todo
  @Post()
  async createTodo(@Body() CreateTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.createTodofunc(CreateTodoDto);
  }

  //Route to get all todos
  @Get()
  async getAllTodos(@Query('status') status?: string) {
    return this.todoService.getAllTodosfunc(status);
  }

  //Route for getting a todo by Id
  @Get(':id')
  async getTodoById(@Param('id') id: string) {
    return this.todoService.getTodoByIdfunc(id);
  }

  //Route for updating a todo by Id
  @Put(':id')
  async updateTodoById(
    @Param('id') id: string,
    @Body() UpdateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.updateTodoByIdfunc(id, UpdateTodoDto);
  }

  //Route for deleting a todo by Id
  @Delete(':id')
  async deleteTodoById(@Param('id') id: string) {
    return this.todoService.deleteTodoByIdfunc(id);
  }
}
