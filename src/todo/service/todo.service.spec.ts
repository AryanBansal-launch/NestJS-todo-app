import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { mock, todo } from 'node:test';
import { Todo } from '../schema/todo.schema';
import {Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let todoservice: TodoService;
  let todomodel: Model<Todo>;


  const mocktodo={
    _id:'5f8d9f4d2a1c7c1e1d1a',
    title:'test',
    completed:false
  }
  // Mock ConfigService
  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const envs = {
        'mongo.uri': 'mongodb://localhost:27017/test-db', 
      };
      return envs[key];
    }),
  };

  beforeEach(async () => {
    const mockTodoModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getModelToken('Todo'),
          useValue: mockTodoModel, 
        },
        {
          provide: ConfigService,
          useValue: mockConfigService, 
        },
      ],
    }).compile();

    todoservice = module.get<TodoService>(TodoService);
    todomodel=module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  it('should be defined', () => {
    expect(todoservice).toBeDefined();
  });

  describe('getAll',()=>{
    it('should return all todos',async()=>{
      jest.spyOn(todomodel,'find').mockResolvedValue([mocktodo]);
      const todos=await todoservice.getAll();
      expect(todos).toEqual([mocktodo]);
    })
  })

  describe('getCompleted', () => {
    it('should return all completed todos', async () => {
      const completedTodos = [{ _id: '1', title: 'Completed Task', completed: true }];
  
      jest.spyOn(todomodel, 'find').mockReturnValue(completedTodos as any);
  
      const todos = await todoservice.getcompleted();
  
      expect(todomodel.find).toHaveBeenCalledWith({ completed: true });
      expect(todos).toEqual(completedTodos);
    });
  });
  
  describe('getNonCompleted', () => {
    it('should return all non-completed todos', async () => {
      const nonCompletedTodos = [{ _id: '2', title: 'Incomplete Task', completed: false }];
  
      jest.spyOn(todomodel, 'find').mockReturnValue(nonCompletedTodos as any);
  
      const todos = await todoservice.getNoncompleted();
  
      expect(todomodel.find).toHaveBeenCalledWith({ completed: false });
      expect(todos).toEqual(nonCompletedTodos);
    });
  });
  

  describe('getById',()=>{
    it('should return a todo by id',async ()=>{
      jest.spyOn(todomodel,'findById').mockResolvedValue(mocktodo);
      const todo=await todoservice.getById(mocktodo._id);
      if(!todo)throw new NotFoundException('Todo Not found');
      expect(todomodel.findById).toHaveBeenCalledWith(mocktodo._id);
      expect(todo).toEqual(mocktodo);
    })
  })

  describe('create',()=>{
    it('should create a todo',async ()=>{
      jest.spyOn(todomodel,'create').mockResolvedValue(mocktodo as any);
      const todo=await todoservice.create('test');
      expect(todomodel.create).toHaveBeenCalledWith({title:'test'});
      expect(todo).toEqual(mocktodo);
    })
  })

  describe('update',()=>{
    it('should update a todo',async ()=>{
      const updatedtodo={...mocktodo,completed:true};
      jest.spyOn(todomodel,'findByIdAndUpdate').mockResolvedValue(updatedtodo as any);
      const todo=await todoservice.update(mocktodo._id,true);
      expect(todomodel.findByIdAndUpdate).toHaveBeenCalledWith(mocktodo._id,{completed:true},{new:true});
      expect(todo).toEqual(updatedtodo);
    })
  })

  describe('delete',()=>{
    it('should delete a todo',async ()=>{
      jest.spyOn(todomodel,'findByIdAndDelete').mockResolvedValue(mocktodo as any);
      const todo=await todoservice.delete(mocktodo._id);
      expect(todomodel.findByIdAndDelete).toHaveBeenCalledWith(mocktodo._id);
      expect(todo).toEqual(mocktodo);
    })
  })
});
