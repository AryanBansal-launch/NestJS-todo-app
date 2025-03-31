import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schema/todo.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

    //function to get all todos
    async getAll():Promise<Todo[]>{
        return await this.todoModel.find();
    }

    //get todo by id
    async getById(id:String):Promise<Todo>{
        const todo=await this.todoModel.findById(id);
        if(!todo){
            throw new NotFoundException('Todo not found');
        }
        return todo;
    }

    //create todo
    async create(title:String):Promise<Todo>{
        const todo=await this.todoModel.create({title});
        return todo;
    }

    //update todo by id
    async update(id:String,completed:boolean):Promise<Todo>{
        const updatedtodo=await this.todoModel.findByIdAndUpdate(id,{completed},{new:true});
        if(!updatedtodo){
            throw new NotFoundException('Todo not found');
        }
        return updatedtodo;
    }
    
    //delete todo by id
    async delete(id:String):Promise<Todo>{
        const deletedtodo=await this.todoModel.findByIdAndDelete(id);
        if(!deletedtodo){
            throw new NotFoundException('Todo not found');
        }
        return deletedtodo;
    }
}
