import { Injectable } from '@nestjs/common';
import { Todo } from '../schema/todo.schema';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import {Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

    async createTodofunc(CreateTodoDto:CreateTodoDto):Promise<Todo>{
        return this.todoModel.create(CreateTodoDto);
    }

    async getAllTodosfunc():Promise<Todo[]>{
        return this.todoModel.find();
    }
    
}
