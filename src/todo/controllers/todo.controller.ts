import { Controller } from '@nestjs/common';
import { Todo } from '../schema/todo.schema';
import { TodoService } from '../service/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto'; 
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { NotFoundException } from '@nestjs/common';
import { Get, Post, Body, Param, Delete, Patch, Put } from '@nestjs/common';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    //get all todos
    @Get('all')
    async getAllTodos(){
        const todos = await this.todoService.getAll();
        return { message: 'Todos retrieved successfully', data: todos };
    }

    //get todo by id
    @Get(':id')
    async getTodoById(@Param('id')id:String){
        const todo=await this.todoService.getById(id);
        if(!todo) throw new NotFoundException('Todo not found');
        return { message: 'Todo retrieved successfully', data: todo };
    }

    //create todo
    @Post('new')
    async createTodo(@Body() todobody: CreateTodoDto){
        const todo=await this.todoService.create(todobody.title);
        return {message:'Todo created successfully',data:todo};
    }

    //update by id
    @Put('/update/:id')
    async updateTodo(@Param('id')id:String,@Body() todobody:UpdateTodoDto){
        const updatedtodo=await this.todoService.update(id,todobody.completed??false);
        if(!updatedtodo)throw new NotFoundException('Todo not found');
        return {message:'Todo updated successfully',data:updatedtodo};
    }

    //delete todo by Id
    @Delete('/delete/:id')
    async deleteTodo(@Param('id')id:String){
        const deletedTodo=await this.todoService.delete(id);
        if(!deletedTodo)throw new NotFoundException('Todo not found');
        return {message:'Todo deleted successfully',data:deletedTodo};
    }
}
