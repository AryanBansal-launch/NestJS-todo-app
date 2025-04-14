import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from '../schema/todo.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  //get all todos 
  async getAll(status?:String):Promise<Todo[]> {
    if (status === 'completed') {
      return await this.todoModel.find({completed:true});
    } else if (status === 'non-completed') {
      return await this.todoModel.find({completed:false});
    }
    return await this.todoModel.find();
  }

  //get todo by id
  async getById(id: String):Promise<Todo> {
    const todo = await this.todoModel.findById(id);
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  //create todo
  async create(title:String):Promise<Todo>{
    return await this.todoModel.create({title});
  }

  //update todo
  async update(id:String,updatebody:UpdateTodoDto):Promise<Todo>{
    const todo=await this.todoModel.findByIdAndUpdate(id,updatebody,{new:true});
    if(!todo)throw new NotFoundException('Todo Not found');
    return todo;
  }

  //delete todo
  async delete(id:String):Promise<Todo>{
    const todo=await this.todoModel.findByIdAndDelete(id);
    if(!todo)throw new NotFoundException('Todo Not Found');
    return todo;
  }
}
