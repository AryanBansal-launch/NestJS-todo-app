import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getModelToken } from '@nestjs/mongoose';
import { Todo } from '../schema/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let todoservice: TodoService;
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

    todoservice = module.get<TodoService>(TodoService);
    todomodel = module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  it('should be defined', () => {
    expect(todoservice).toBeDefined();
  });

  describe('Testing the todo CRUD service', () => {
    //test for crete todo service
    describe('createTodo', () => {
      it('should create a todo', async () => {
        (todomodel.create as jest.Mock).mockResolvedValue(mocktodo);
        const todo = await todoservice.createTodo({ title: 'test' });
        expect(todomodel.create).toHaveBeenCalledWith({ title: 'test' });
        expect(todo).toEqual(mocktodo);
      });
    });

    describe('getAllTodos', () => {
      it('should return all todos', async () => {
        (todomodel.find as jest.Mock).mockResolvedValue([mocktodo]);
        const todos = await todoservice.getAllTodos();
        expect(todomodel.find).toHaveBeenCalledWith();
        expect(todos).toEqual([mocktodo]);
      });
      it('should return all completed todos', async () => {
        const truetodo = { ...mocktodo, completed: true };
        (todomodel.find as jest.Mock).mockResolvedValue([truetodo]);
        const todos = await todoservice.getAllTodos('complete');
        expect(todomodel.find).toHaveBeenCalledWith({ completed: true });
        expect(todos).toEqual([truetodo]);
      });
      it('should return all incomplete todos', async () => {
        (todomodel.find as jest.Mock).mockResolvedValue([mocktodo]);
        const todos = await todoservice.getAllTodos('incomplete');
        expect(todomodel.find).toHaveBeenCalledWith({ completed: false });
        expect(todos).toEqual([mocktodo]);
      });
    });

    describe('getTodoById', () => {
      it('should return a todo by id', async () => {
        (todomodel.findById as jest.Mock).mockResolvedValue(mocktodo);
        const todo = await todoservice.getTodoById('5f8d9f4d2a1c7c1e1d1a');
        expect(todomodel.findById).toHaveBeenCalledWith('5f8d9f4d2a1c7c1e1d1a');
        expect(todo).toEqual(mocktodo);
      });

      it('should throw a NotFoundException if todo is not found', async () => {
        (todomodel.findById as jest.Mock).mockResolvedValue(null);
        await expect(todoservice.getTodoById('nonexistentId')).rejects.toThrow(
          NotFoundException,
        );
        expect(todomodel.findById).toHaveBeenCalledWith('nonexistentId');
      });
    });

    describe('updateTodo',()=>{
      it('should update a todo',async()=>{
        
      })
    })
  });
});
