import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from '../schema/todo.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let todoservice: TodoService;
  let todomodel: Model<Todo>;

  const mocktodo1 = {
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
          provide: getModelToken('Todo'),
          useValue: mockTodoModel,
        },
      ],
    }).compile();

    todoservice = module.get<TodoService>(TodoService);
    todomodel = module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  // it('should be defined', () => {
  //   expect(todoservice).toBeDefined();
  // });

  describe('Testing the Todo CRUD service', () => {
    describe('getAll', () => {
      it('should return all todos', async () => {
        // jest.spyOn(todomodel,'find').mockResolvedValue([mocktodo]);
        (todomodel.find as jest.Mock).mockResolvedValue([mocktodo1]);
        const todos = await todoservice.getAll();
        expect(todos).toEqual([mocktodo1]);
      });
      it('should return all completed todos', async () => {
        const mocktruetodo = { ...mocktodo1, completed: true };
        // jest.spyOn(todomodel,'find').mockResolvedValue([mocktodo]);
        (todomodel.find as jest.Mock).mockResolvedValue([mocktruetodo]);
        const todos = await todoservice.getAll('completed');
        expect(todos).toEqual([mocktruetodo]);
      });
      it('should return all incomplete todos', async () => {
        const mockfalsetodo = { ...mocktodo1, completed: false };
        // jest.spyOn(todomodel,'find').mockResolvedValue([mocktodo]);
        (todomodel.find as jest.Mock).mockResolvedValue([mockfalsetodo]);
        const todos = await todoservice.getAll('non-completed');
        expect(todos).toEqual([mockfalsetodo]);
      });
    });

    describe('getById', () => {
      it('should return a todo by id', async () => {
        // jest.spyOn(todomodel,'findById').mockResolvedValue(mocktodo);
        (todomodel.findById as jest.Mock).mockResolvedValue(mocktodo1);
        const todo = await todoservice.getById(mocktodo1._id);
        if (!todo) throw new NotFoundException('Todo Not found');
        expect(todomodel.findById).toHaveBeenCalledWith(mocktodo1._id);
        expect(todo).toEqual(mocktodo1);
      });
    });

    describe('create', () => {
      it('should create a todo', async () => {
        // jest.spyOn(todomodel,'create').mockResolvedValue(mocktodo as any);
        (todomodel.create as jest.Mock).mockResolvedValue(mocktodo1);
        const todo = await todoservice.create('test');
        expect(todomodel.create).toHaveBeenCalledWith({ title: 'test' });
        expect(todo).toEqual(mocktodo1);
      });
    });

    describe('update', () => {
      it('should update a todo', async () => {
        const updatedtodo = { ...mocktodo1, completed: true };
        // jest.spyOn(todomodel,'findByIdAndUpdate').mockResolvedValue(updatedtodo as any);
        (todomodel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
          updatedtodo,
        );
        const todo = await todoservice.update(mocktodo1._id, {
          completed: true,
        });
        expect(todomodel.findByIdAndUpdate).toHaveBeenCalledWith(
          mocktodo1._id,
          { completed: true },
          { new: true },
        );
        expect(todo).toEqual(updatedtodo);
      });
    });

    describe('delete', () => {
      it('should delete a todo', async () => {
        // jest.spyOn(todomodel,'findByIdAndDelete').mockResolvedValue(mocktodo as any);
        (todomodel.findByIdAndDelete as jest.Mock).mockResolvedValue(mocktodo1);
        const todo = await todoservice.delete(mocktodo1._id);
        expect(todomodel.findByIdAndDelete).toHaveBeenCalledWith(mocktodo1._id);
        expect(todo).toEqual(mocktodo1);
      });
    });
  });
});
