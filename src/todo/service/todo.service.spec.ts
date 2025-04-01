import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { todo } from 'node:test';
import { Todo } from '../schema/todo.schema';
import {Model } from 'mongoose';

describe('TodoService', () => {
  let todoservice: TodoService;
  let todomodel: Model<Todo>;


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

});
