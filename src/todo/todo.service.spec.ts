import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { Todo } from './schema/todo.schema';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { mock } from 'node:test';

describe('TodoService', () => {
  let todoservice: TodoService;
  let todomodel:Model<Todo>;

  const mockTodo = {
    _id: '65f1234567890abcdef12345',
    title: 'test',
    completed: false,
  };

  beforeEach(async () => {
    const mocktodoModel={
      create:jest.fn(),
      find:jest.fn(),
      findById:jest.fn(),
      findByIdAndUpdate:jest.fn(),
      findByIdAndDelete:jest.fn(),
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService,{
        provide:getModelToken(Todo.name),
        useValue:mocktodoModel,
      }],
    }).compile();

    todoservice = module.get<TodoService>(TodoService);
    todomodel=module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  it('should be defined', () => {
    expect(todoservice).toBeDefined();
  });

  describe('getAll',()=>{
    it('should return all todes',async ()=>{
      jest.spyOn(todomodel,'find').mockResolvedValue([mockTodo]);
      const todos=await todoservice.getAll();
      expect(todomodel.find).toHaveBeenCalled();
      expect(todos).toEqual([mockTodo]);
    })
  })

  describe('getById',()=>{
    it('should return todo by id',async()=>{
      jest.spyOn(todomodel,'findById').mockResolvedValue(mockTodo);
      const todo=await todoservice.getById(mockTodo._id);
      expect(todomodel.findById).toHaveBeenCalledWith(mockTodo._id);
      expect(todo).toEqual(mockTodo);
    })
    it('should throw not found exception',async ()=>{
      jest.spyOn(todomodel, 'findById').mockResolvedValue(null);
      await expect(todoservice.getById(mockTodo._id)).rejects.toThrow(NotFoundException);
    })
  })

  describe('create',()=>{
    it('should create a todo',async ()=>{
      jest.spyOn(todomodel,'create').mockResolvedValue(mockTodo as any);
      const todo=await todoservice.create('test');
      expect(todomodel.create).toHaveBeenCalledWith({title:'test'});
      expect(todo).toEqual(mockTodo);
    })
  })

  describe('update',()=>{
    it('should update a todo',async ()=>{
      const updatedtodo={...mockTodo,completed:true};
      jest.spyOn(todomodel,'findByIdAndUpdate').mockResolvedValue(updatedtodo);
      const todo=await todoservice.update(mockTodo._id,true);
      expect(todomodel.findByIdAndUpdate).toHaveBeenCalledWith(mockTodo._id,{completed:true},{new:true});
      expect(todo).toEqual(updatedtodo);
    })
    it('should throw not found exception',async ()=>{
      jest.spyOn(todomodel, 'findByIdAndUpdate').mockResolvedValue(null);
      await expect(todoservice.update(mockTodo._id,true)).rejects.toThrow(NotFoundException);
    })
  })

  describe('delete',()=>{
    it('should delete a todo',async()=>{
      jest.spyOn(todomodel,'findByIdAndDelete').mockResolvedValue(mockTodo);
      const todo=await todoservice.delete(mockTodo._id);
      expect(todomodel.findByIdAndDelete).toHaveBeenCalledWith(mockTodo._id);
      expect(todo).toEqual(mockTodo);
    })
    it('should throw not found exception',async ()=>{
      jest.spyOn(todomodel, 'findByIdAndDelete').mockResolvedValue(null);
      await expect(todoservice.delete(mockTodo._id)).rejects.toThrow(NotFoundException);
    })
  })
});
