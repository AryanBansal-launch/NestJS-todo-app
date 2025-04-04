import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from '../schema/todo.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo> ,private configService: ConfigService) {}

  //get all todos 
  async getAll():Promise<Todo[]> {
    return await this.todoModel.find();
  }

  //get all completed todos
  async getcompleted():Promise<Todo[]>{
    return await this.todoModel.find({completed:true});
  }

  //get all non completed todos
  async getNoncompleted():Promise<Todo[]>{
    return await this.todoModel.find({completed:false});
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
  async update(id:String,completed:boolean):Promise<Todo>{
    const todo=await this.todoModel.findByIdAndUpdate(id,{completed},{new:true});
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
