import { Injectable } from '@nestjs/common';
import { Todo } from '../schema/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import {Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { stat } from 'fs';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

    //Method to create a todo
    async createTodofunc(CreateTodoDto:CreateTodoDto):Promise<Todo>{
        return this.todoModel.create(CreateTodoDto);
    }

    //Method to get all todos
    async getAllTodosfunc(status?:string):Promise<Todo[]>{
        if(status=='complete'){
            return this.todoModel.find({completed:true});
        }
        if(status=='incomplete'){
            return this.todoModel.find({completed:false});
        }
        else{
            return this.todoModel.find();
        }
    }

    //Method to get a todo by id
    async getTodoByIdfunc(id:string):Promise<Todo>{
        const todo=await this.todoModel.findById(id);
        if(!todo){
            throw new NotFoundException(`Todo with id ${id} not found`);
        }
        return todo;
    }

    //Method to update a todo by id
    async updateTodoByIdfunc(id:string,todoBody:UpdateTodoDto):Promise<Todo>{
         const todo=await this.todoModel.findByIdAndUpdate(id,todoBody,{new:true});
        if(!todo){
            throw new NotFoundException(`Todo with id ${id} not found`);
        }
        return todo;
    }

    //Method to delete a todo by id
    async deleteTodoByIdfunc(id:string):Promise<void>{
        const todo=await this.todoModel.findByIdAndDelete(id);
        if(!todo){
            throw new NotFoundException(`Todo with id ${id} not found`);
        }
    }
}
