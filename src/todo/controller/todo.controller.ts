import { Controller } from '@nestjs/common';
import { TodoService } from '../service/todo.service';
import { Todo } from '../schema/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import {GET, POST, PUT, DELETE} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body, Param, Query} from '@nestjs/common/decorators/http/route-params.decorator';
@Controller('todo')
export class TodoController {
    constructor (private readonly todoService:TodoService){}

    @Post()
    async createTodo(@Body() CreateTodoDto: CreateTodoDto): Promise<Todo> {
        return this.todoService.createTodo(CreateTodoDto);
    }
}
