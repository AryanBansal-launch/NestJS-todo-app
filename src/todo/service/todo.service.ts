import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from '../schema/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  //method for creating a todo
  async createTodo(Todobody: CreateTodoDto): Promise<Todo> {
    return await this.todoModel.create(Todobody);
  }

  //method to get all todos
  async getAllTodos(status?: string): Promise<Todo[]> {
    if (status == 'complete') {
      return await this.todoModel.find({ completed: true });
    }
    if (status == 'incomplete') {
      return await this.todoModel.find({ completed: false });
    } else {
      return await this.todoModel.find();
    }
  }

  //method to get a todo by Id
  async getTodoById(id: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  //method to update a todo
  async updateTodo(id: string, Todobody: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoModel.findByIdAndUpdate(id, Todobody, {
      new: true,
    });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  //method to delete a todo
  async deleteTodo(id: string): Promise<Todo> {
    const todo = await this.todoModel.findByIdAndDelete(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }
}
