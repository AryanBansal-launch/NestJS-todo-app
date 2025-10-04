/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from '../dto/CreateTodoDTO/create-todo.dto';
import { Todo } from '../schema/todo.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateTodoDto } from '../dto/UpdateTodoDTO/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}
  getHealth(): string {
    return 'health Check completed';
  }
  //create todo
  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = await  this.todoModel.create(createTodoDto);
    return createdTodo;
  }

  //get all todos
  async getAllTodos(status?: string): Promise<Todo[]> {
    if (status == 'completed') {
      return await this.todoModel.find({ completed: true });
    } else if (status == 'incomplete') {
      return await this.todoModel.find({ completed: false });
    } else {
      return await this.todoModel.find();
    }
  }

  //get tofo by id
  async getTodoById(id:string):Promise<Todo>{
    const todo = await this.todoModel.findById(id);
    if(!todo){
        throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  //update todo
  async updateTodo(id:string, updatedbody:UpdateTodoDto):Promise<Todo>{
    const todo = await this.todoModel.findByIdAndUpdate(id, updatedbody, {new:true});
    if(!todo){
        throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  //delete todo
  async deleteTodo(id:string):Promise<Todo>{
    const todo = await this.todoModel.findByIdAndDelete(id);
    if(!todo){
        throw new NotFoundException('Todo not found');
    }
    return todo;
  }
}
