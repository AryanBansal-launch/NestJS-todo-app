import { Controller } from '@nestjs/common';
import { TodoService } from '../service/todo.service';
import { Todo } from '../schema/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { Get, Post, Body, Param, Delete, Put ,Query} from '@nestjs/common';
@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    //CRUD API calls for todo
    //for creating todo
    @Post()
    async createTodo(@Body() todobody:CreateTodoDto){
        return await this.todoService.createTodo(todobody);
    }

    //for geting all todos

    @Get()
    async getAllTodos(@Query('status') status?:string){
        return await this.todoService.getAllTodos(status);
    }

    //for geting a todo by id
    @Get(':id')
    async getTodoById(@Param('id') id:string){
        return await this.todoService.getTodoById(id);
    }

    //for updating a todo
    @Put(':id')
    async updateTodo(@Param('id') id:string,@Body() todobody:UpdateTodoDto){
        return await this.todoService.updateTodo(id,todobody);
    }

    //for deleting a todo
    @Delete(':id')
    async deleteTodo(@Param('id') id:string){
        return await this.todoService.deleteTodo(id);
    }
}
