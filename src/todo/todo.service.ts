import { Injectable } from '@nestjs/common';
import { Todo } from './schemas/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  //function to get all todos
  async getAll(): Promise<Todo[]> {
    return await this.todoModel.find();
  }

  //get todo by id
  async getById(id: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id);
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  //create todo
  async create(title: String): Promise<Todo> {
    return await this.todoModel.create({ title });
  }

  //update todo
  async update(id: string, completed: boolean): Promise<Todo> {
    const updatedTodo = await this.todoModel.findByIdAndUpdate(id, { completed }, { new: true }).exec();
    if (!updatedTodo) throw new NotFoundException('Todo not found');
    return updatedTodo;
  }

  //delete todo
  async delete(id:String):Promise<Todo>{
    const deltetdTodo=await this.todoModel.findByIdAndDelete(id);
    if(!deltetdTodo)throw new NotFoundException('Todo not found');
    return deltetdTodo;
  }
}
