import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from '../schema/todo.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
describe('TodoService', () => {
  let todoService: TodoService;
  let todomodel: Model<Todo>;
  const mocktodo = {
    _id: '5f8d9f4d2a1c7c1e1d1a',
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
    todomodel = module.get<Model<Todo>>(getModelToken(Todo.name));
  });
  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('Testing CRUD services in Todo', () => {
    describe('CreateTodo', () => {
      it('should create a todo', async () => {
        (todomodel.create as jest.Mock).mockResolvedValue(mocktodo);
        const todo = await todoService.createTodo({
          title: 'test',
          completed: false,
        });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todomodel.create).toHaveBeenCalledWith({
          title: 'test',
          completed: false,
        });
        expect(todo).toEqual(mocktodo);
      });
    });

    describe('getAllTodos', () => {
      it('should return all todos', async () => {
        (todomodel.find as jest.Mock).mockResolvedValue([mocktodo]);
        const todos = await todoService.getAllTodos();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todomodel.find).toHaveBeenCalled();
        expect(todos).toEqual([mocktodo]);
      });

      it('should return all completed todos', async () => {
        const completedTodo = { ...mocktodo, completed: true };
        (todomodel.find as jest.Mock).mockResolvedValue([completedTodo]);
        const todos = await todoService.getAllTodos('completed');
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todomodel.find).toHaveBeenCalledWith({ completed: true });
        expect(todos).toEqual([completedTodo]);
      });

      it('should return all incomplete todos', async () => {
        const incompleteTodo = { ...mocktodo, completed: false };
        (todomodel.find as jest.Mock).mockResolvedValue([incompleteTodo]);
        const todos = await todoService.getAllTodos('incomplete');
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todomodel.find).toHaveBeenCalledWith({ completed: false });
        expect(todos).toEqual([incompleteTodo]);
      });
    });

    describe('getTodoById', () => {
      it('should return a todo by id', async () => {
        (todomodel.findById as jest.Mock).mockResolvedValue(mocktodo);
        const todo = await todoService.getTodoById(mocktodo._id);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todomodel.findById).toHaveBeenCalledWith(mocktodo._id);
        expect(todo).toEqual(mocktodo);
      });
      it('should throw an error if todo is not found', async () => {
        (todomodel.findById as jest.Mock).mockResolvedValue(null);
        await expect(todoService.getTodoById(mocktodo._id)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateTodo', () => {
      it('should update a todo', async () => {
        const updatedTodo = { ...mocktodo, completed: true };
        (todomodel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
          updatedTodo,
        );
        const todo = await todoService.updateTodo(mocktodo._id, {
          completed: true,
        });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todomodel.findByIdAndUpdate).toHaveBeenCalledWith(
          mocktodo._id,
          { completed: true },
          { new: true },
        );
        expect(todo).toEqual(updatedTodo);
      });
      it('should throw an error if todo is not found', async () => {
        (todomodel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
        await expect(
          todoService.updateTodo(mocktodo._id, { completed: true }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('deleteTodo', () => {
      it('should delete a todo', async () => {
        (todomodel.findByIdAndDelete as jest.Mock).mockResolvedValue(mocktodo);
        const todo = await todoService.deleteTodo(mocktodo._id);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(todomodel.findByIdAndDelete).toHaveBeenCalledWith(mocktodo._id);
        expect(todo).toEqual(mocktodo);
      });
      it('should throw an error if todo is not found', async () => {
        (todomodel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
        await expect(todoService.deleteTodo(mocktodo._id)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
