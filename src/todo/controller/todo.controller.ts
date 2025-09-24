import { Controller, Get } from '@nestjs/common';
import { TodoService } from '../service/todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getHello(): string {
    return 'hello';
  }
}
