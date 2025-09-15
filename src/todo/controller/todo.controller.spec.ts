import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from '../service/todo.service';
import { NotFoundException } from '@nestjs/common';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  const mockTodo = {
    _id: '65f1234567890abcdef12345',
    title: 'test',
    completed: false,
  };
  const mockTodoService = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Testing the todo CRUD controller', () => {
    //create todo
    describe('createTodo', () => {
      it('should create a todo', async () => {
        const createTodoDto = { title: 'test' };
        const result = await controller.createTodo(createTodoDto);
        expect(result).toEqual(mockTodo);
        expect(service.createTodo).toHaveBeenCalledWith(createTodoDto);
      });
    });

    //get all todos
    describe('getAllTodos', () => {
      it('should return all todos', async () => {
        (service.getAllTodos as jest.Mock).mockResolvedValue([mockTodo]);
        const todos = await controller.getAllTodos();
        expect(todos).toEqual([mockTodo]);
        expect(service.getAllTodos).toHaveBeenCalled();
      });
      it('should return all completed todos', async () => {
        const completemocktodo = { ...mockTodo, completed: true };
        (service.getAllTodos as jest.Mock).mockResolvedValue([
          completemocktodo,
        ]);
        const todos = await controller.getAllTodos('complete');
        expect(todos).toEqual([completemocktodo]);
        expect(service.getAllTodos).toHaveBeenCalledWith('complete');
      });
      it('should return all incomplete todos', async () => {
        const incompletemocktodo = { ...mockTodo, completed: false };
        (service.getAllTodos as jest.Mock).mockResolvedValue([
          incompletemocktodo,
        ]);
        const todos = await controller.getAllTodos('incomplete');
        expect(todos).toEqual([incompletemocktodo]);
        expect(service.getAllTodos).toHaveBeenCalledWith('incomplete');
      });
    });

    //get todo by id
    describe('getTodoById', () => {
      it('should return a tod by id', async () => {
        const result = await controller.getTodoById(mockTodo._id);
        expect(result).toEqual(mockTodo);
        expect(service.getTodoById).toHaveBeenCalledWith(mockTodo._id);
      });
      it('should throw NotFoundException when todo not found by id', async () => {
        mockTodoService.getTodoById.mockRejectedValue(
          new NotFoundException('Todo not found'),
        );

        await expect(controller.getTodoById('invalidId')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    //update todo
    describe('updateTodo', () => {
      it('should update a todo', async () => {
        const updatedTodo = { ...mockTodo, completed: true };
        (service.updateTodo as jest.Mock).mockResolvedValue(updatedTodo);
        const result = await controller.updateTodo(mockTodo._id, {
          completed: true,
        });
        expect(result).toEqual(updatedTodo);
        expect(service.updateTodo).toHaveBeenCalledWith(mockTodo._id, {
          completed: true,
        });
      });

      it('should throw NotFoundException when todo not found', async () => {
        (service.updateTodo as jest.Mock).mockRejectedValue(
          new NotFoundException('Todo not found'),
        );
        await expect(
          controller.updateTodo('invalidId', { completed: true }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('deleteTodo', () => {
      it('should delete a todo', async () => {
        const result = await controller.deleteTodo(mockTodo._id);
        expect(result).toEqual(mockTodo);
        expect(service.deleteTodo).toHaveBeenCalledWith(mockTodo._id);
      });

      it('should throw NotFoundException when todo not found', async () => {
        (service.deleteTodo as jest.Mock).mockRejectedValue(
          new NotFoundException('Todo not found'),
        );
        await expect(controller.deleteTodo('invalidId')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
