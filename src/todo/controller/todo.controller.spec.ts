import { TodoController } from './todo.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../service/todo.service';
import { NotFoundException } from '@nestjs/common';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const mockTodo = {
      _id: '65f1234567890abcdef12345',
      title: 'test',
      completed: false,
    };
    const mockTodoService = {
      getHealth: jest.fn().mockReturnValue('health Check completed'),
      getAllTodos: jest.fn(),
      getTodoById: jest.fn().mockImplementation((id: string) => {
        return id === mockTodo._id
          ? Promise.resolve(mockTodo)
          : Promise.resolve(null);
      }),
      createTodo: jest.fn().mockResolvedValue(mockTodo),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn().mockResolvedValue(mockTodo),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compile();

    todoController = app.get<TodoController>(TodoController);
    todoService = app.get<TodoService>(TodoService);
  });

  describe('root', () => {
    it('Should be defined', () => {
      expect(todoController).toBeDefined();
    });
  });

  describe('testing Todo CRUD controller', () => {
    describe('getHealth', () => {
      it('should return health check', () => {
        const result = todoController.getHealth();
        expect(result).toBe('health Check completed');
      });
    });
  });
});
