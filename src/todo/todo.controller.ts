import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete, 
    Param, 
    Body, 
    HttpException 
  } from '@nestjs/common';
  import { TodoService } from './todo.service';
  import { CreateTodoDto } from './dto/create-todo.dto';
  import { UpdateTodoDto } from './dto/update-todo.dto';
  
  @Controller('todo')
  export class TodoController {
    constructor(private readonly todoService: TodoService) {}
  
    // Get all todos
    @Get()
    async getAllTodos() {
      return { message: 'Todos retrieved successfully', data: await this.todoService.getAll() };
    }
  
    // Get todo by ID
    @Get(':id')
    async getTodoById(@Param('id') id: string) {
      const todo = await this.todoService.getById(id);
      if (!todo) throw new HttpException('Todo not found', 404);
      return { message: 'Todo retrieved successfully', data: todo };
    }
  
    // Create a new todo
    @Post('create')
    async createTodo(@Body() todoBody: CreateTodoDto) {
      return { message: 'Todo created successfully', data: await this.todoService.create(todoBody.title) };
    }
  
    // Update todo
    @Put('/update/:id')
    async updateTodo(@Param('id') id: string, @Body() todoBody: UpdateTodoDto) {
      const updatedTodo = await this.todoService.update(id, todoBody.completed ?? false);
      if (!updatedTodo) throw new HttpException('Todo not found', 404);
      return { message: 'Todo updated successfully', data: updatedTodo };
    }
  
    // Delete todo
    @Delete('/delete/:id')
    async deleteTodo(@Param('id') id: string) {
      const deleted = await this.todoService.delete(id);
      if (!deleted) throw new HttpException('Todo not found', 404);
      return { message: 'Todo deleted successfully' };
    }
  }
  