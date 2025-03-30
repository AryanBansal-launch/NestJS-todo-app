import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './schemas/todo.schema';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoModel: Model<Todo>;

  const mockTodo = {
    _id: '65f1234567890abcdef12345',
    title: 'test',
    completed: false,
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
          provide: getModelToken(Todo.name),
          useValue: mockTodoModel,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoModel = module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  //testing findby id method
  describe('findById',()=>{
    it('should return todo',async ()=>{
      jest.spyOn(todoModel, 'findById').mockResolvedValue(mockTodo);
      const todo = await todoService.getById(mockTodo._id);
      expect(todo).toEqual(mockTodo);
    })
    it('should throw not found exception',async ()=>{
      jest.spyOn(todoModel, 'findById').mockResolvedValue(null);
      await expect(todoService.getById(mockTodo._id)).rejects.toThrow(NotFoundException);
    })
  })

  //testing for creating a todo
  describe('create', () => {
    it('should create a todo', async () => {
      jest.spyOn(todoModel, 'create').mockResolvedValue(mockTodo as any);
  
      const todo = await todoService.create(mockTodo.title);
  
      expect(todo).toEqual(mockTodo);
      expect(todoModel.create).toHaveBeenCalledWith({ title: mockTodo.title });
    });
  });

  //testing for updating a todo
  describe('update',()=>{
    it('should update a todo',async ()=>{
      jest.spyOn(todoModel, 'findByIdAndUpdate').mockResolvedValue(mockTodo as any);
      const todo = await todoService.update(mockTodo._id,true);
      expect(todo).toEqual(mockTodo);
      expect(todoModel.findByIdAndUpdate).toHaveBeenCalledWith(mockTodo._id,{completed:true},{new:true});
    })
    it('should throw not found exception',async ()=>{
      jest.spyOn(todoModel, 'findByIdAndUpdate').mockResolvedValue(null);
      await expect(todoService.update(mockTodo._id,true)).rejects.toThrow(NotFoundException);
    })
  })

  //testing for deleting a todo
  describe('delete',()=>{
    it('should delete and return the deleted todo', async () => {
      jest.spyOn(todoModel, 'findByIdAndDelete').mockResolvedValue(mockTodo as any);
      const deletedTodo = await todoService.delete(mockTodo._id);
      expect(deletedTodo).toEqual(mockTodo);
      expect(todoModel.findByIdAndDelete).toHaveBeenCalledWith(mockTodo._id);
    });

    it('should throw not found exception',async ()=>{
      jest.spyOn(todoModel, 'findByIdAndDelete').mockResolvedValue(null);
      await expect(todoService.delete(mockTodo._id)).rejects.toThrow(NotFoundException);
    })
  })
  
});
