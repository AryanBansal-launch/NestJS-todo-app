import { Controller } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Get, Post, Body, Param, Delete, Patch ,Put} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService:TodoService){}

    @Get('all')
    async getAllTodos(){
        const todos=await this.todoService.getAll();
        return {message:'Todos retrieved successfully',data:todos};
    }

    @Get(':id')
    async getTodoById(@Param('id')id:string){
        const todo=await this.todoService.getById(id);
        if (!todo) throw new NotFoundException('Todo not found');
        return { message: 'Todo retrieved successfully', data: todo };
    }

    @Post('new')
    async createTodo(@Body() createTodoDto: CreateTodoDto) {
        const todo = await this.todoService.create(createTodoDto.title);
        return { message: 'Todo created successfully', data: todo };
    }

    @Put('/update/:id')
    async updateTodo(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
        const todo=await this.todoService.update(id,updateTodoDto.completed??false);
        if(!todo) throw new NotFoundException('Todo not found');
        return { message: 'Todo updated successfully', data: todo };
    }

    @Delete('/delete/:id')
    async deleteTodo(@Param('id') id:String){
        const todo=await this.todoService.delete(id);
        if(!todo) throw new NotFoundException('Todo not found');
        return { message: 'Todo deleted successfully', data: todo };
    }

}
