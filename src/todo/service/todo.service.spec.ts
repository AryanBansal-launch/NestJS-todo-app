import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

describe('TodoService', () => {
  let service: TodoService;

  // Mock Mongoose Model
  const mockTodoModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

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

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
