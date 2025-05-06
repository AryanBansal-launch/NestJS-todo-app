import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from '../schema/todo.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NotFoundException } from '@nestjs/common';
import { Document } from 'mongoose';

// Extend the Todo interface to include _id
interface TodoDocument extends Todo, Document {
  _id: string;
}

describe('TodoService Integration Tests', () => {
  let service: TodoService;
  let module: TestingModule;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async () => ({
            uri: uri,
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
      ],
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  afterAll(async () => {
    await module.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    const model = module.get('TodoModel');
    await model.deleteMany({});
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const todoData = { title: 'Test Todo', completed: false };
      const todo = await service.createTodo(todoData) as TodoDocument;

      expect(todo).toBeDefined();
      expect(todo.title).toBe(todoData.title);
      expect(todo.completed).toBe(todoData.completed);
      expect(todo._id).toBeDefined();
    });
  });

  describe('getAllTodos', () => {
    it('should return all todos', async () => {
      // Create some test todos
      await service.createTodo({ title: 'Todo 1', completed: false });
      await service.createTodo({ title: 'Todo 2', completed: true });

      const todos = await service.getAllTodos();
      expect(todos).toHaveLength(2);
    });

    it('should filter completed todos', async () => {
      await service.createTodo({ title: 'Todo 1', completed: false });
      await service.createTodo({ title: 'Todo 2', completed: true });

      const completedTodos = await service.getAllTodos('complete');
      expect(completedTodos).toHaveLength(1);
      expect(completedTodos[0].completed).toBe(true);
    });

    it('should filter incomplete todos', async () => {
      await service.createTodo({ title: 'Todo 1', completed: false });
      await service.createTodo({ title: 'Todo 2', completed: true });

      const incompleteTodos = await service.getAllTodos('incomplete');
      expect(incompleteTodos).toHaveLength(1);
      expect(incompleteTodos[0].completed).toBe(false);
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', async () => {
      const createdTodo = await service.createTodo({ title: 'Test Todo', completed: false }) as TodoDocument;
      const foundTodo = await service.getTodoById(createdTodo._id.toString()) as TodoDocument;

      expect(foundTodo).toBeDefined();
      expect(foundTodo._id.toString()).toBe(createdTodo._id.toString());
    });

    it('should throw NotFoundException for non-existent id', async () => {
      await expect(service.getTodoById('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const createdTodo = await service.createTodo({ title: 'Test Todo', completed: false }) as TodoDocument;
      const updatedTodo = await service.updateTodo(createdTodo._id.toString(), { completed: true }) as TodoDocument;

      expect(updatedTodo.completed).toBe(true);
      expect(updatedTodo._id.toString()).toBe(createdTodo._id.toString());
    });

    it('should throw NotFoundException when updating non-existent todo', async () => {
      await expect(service.updateTodo('507f1f77bcf86cd799439011', { completed: true }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const createdTodo = await service.createTodo({ title: 'Test Todo', completed: false }) as TodoDocument;
      const deletedTodo = await service.deleteTodo(createdTodo._id.toString()) as TodoDocument;

      expect(deletedTodo._id.toString()).toBe(createdTodo._id.toString());
      
      // Verify the todo is actually deleted
      await expect(service.getTodoById(createdTodo._id.toString())).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when deleting non-existent todo', async () => {
      await expect(service.deleteTodo('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });
}); 