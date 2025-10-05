/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { TodoController } from './todo.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../service/todo.service';
import { NotFoundException } from '@nestjs/common';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;
  let mockTodo: any;

  beforeEach(async () => {
    mockTodo = {
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
  describe('testing Todo CRUD controller', () => {
    describe('getHealth', () => {
      it('should return health check', () => {
        const result = todoController.getHealth();
        expect(result).toBe('health Check completed');
      });
    });
    describe('createTodo', () => {
      it('should create a todo', async () => {
        const createTodoDto = { title: 'test' };
        const todo = await todoController.createTodo(createTodoDto);
        expect(todo).toEqual(mockTodo);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todoService.createTodo).toHaveBeenCalledWith(createTodoDto);
      });
    });
    describe('getAllTodos', () => {
      it('should return all todos', async () => {
        (todoService.getAllTodos as jest.Mock).mockResolvedValue([mockTodo]);
        const todos = await todoController.getAllTodos();
        expect(todos).toEqual([mockTodo]);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todoService.getAllTodos).toHaveBeenCalled();
      });
      it('should return all completed todos', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const mockCompletedTodo = { ...mockTodo, completed: true };
        (todoService.getAllTodos as jest.Mock).mockResolvedValue([
          mockCompletedTodo,
        ]);
        const todos = await todoController.getAllTodos('completed');
        expect(todos).toEqual([mockCompletedTodo]);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todoService.getAllTodos).toHaveBeenCalledWith('completed');
      });
      it('should return all incomplete todos', async () => {
        (todoService.getAllTodos as jest.Mock).mockResolvedValue([mockTodo]);
        const todos = await todoController.getAllTodos('incomplete');
        expect(todos).toEqual([mockTodo]);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todoService.getAllTodos).toHaveBeenCalledWith('incomplete');
      });
    });
    describe('getTodoById', () => {
      it('should return a todo by id', async () => {
        (todoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo);
        const todo = await todoController.getTodoById(mockTodo._id);
        expect(todo).toEqual(mockTodo);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todoService.getTodoById).toHaveBeenCalledWith(mockTodo._id);
      });
      it('should throw NotFoundException when todo not found by id', async () => {
        (todoService.getTodoById as jest.Mock).mockRejectedValue(
          new NotFoundException('Todo not found'),
        );

        await expect(todoController.getTodoById('invalidId')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
    describe('updateTodo', () => {
      it('should update a todo', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const updatedTodo = { ...mockTodo, completed: true };
        (todoService.updateTodo as jest.Mock).mockResolvedValue(updatedTodo);
        const todo = await todoController.updateTodo(mockTodo._id, {
          completed: true,
        });
        expect(todo).toEqual(updatedTodo);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todoService.updateTodo).toHaveBeenCalledWith(mockTodo._id, {
          completed: true,
        });
      });
      it('should throw NotFoundException when todo not found by id', async () => {
        (todoService.updateTodo as jest.Mock).mockRejectedValue(
          new NotFoundException('Todo not found'),
        );
        await expect(
          todoController.updateTodo('invalidId', { completed: true }),
        ).rejects.toThrow(NotFoundException);
      });
    });
    describe('deleteTodo', () => {
      it('should delete a todo', async () => {
        (todoService.deleteTodo as jest.Mock).mockResolvedValue(mockTodo);
        const todo = await todoController.deleteTodo(mockTodo._id);
        expect(todo).toEqual(mockTodo);
      });
      it('should throw NotFoundException when todo not found by id', async () => {
        (todoService.deleteTodo as jest.Mock).mockRejectedValue(
          new NotFoundException('Todo not found'),
        );
        await expect(todoController.deleteTodo('invalidId')).rejects.toThrow(NotFoundException);
      });
    });
  });
});
