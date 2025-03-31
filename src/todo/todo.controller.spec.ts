import { mock } from 'node:test';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { Todo } from './schema/todo.schema';
import { TodoService } from './todo.service';
import { NotFoundException } from '@nestjs/common';

describe('TodoController', () => {
  let todocontroller: TodoController;
  let todoservice:TodoService;

  const mockTodo = {
    _id: '65f1234567890abcdef12345',
    title: 'test',
    completed: false,
  };
  const mockTodoservice = {
    getAll: jest.fn().mockResolvedValue([mockTodo]),
    getById: jest.fn().mockImplementation((id) => {
      return id === mockTodo._id ? Promise.resolve(mockTodo) : Promise.resolve(null);
    }),
    create: jest.fn().mockResolvedValue(mockTodo),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue(mockTodo),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoservice }],
    }).compile();

    todocontroller = module.get<TodoController>(TodoController);
    todoservice = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todocontroller).toBeDefined();
  });

  describe('getAllTodos', () => {
    it('should return all todos', async () => {
      const todos=await todocontroller.getAllTodos();
      expect(todoservice.getAll).toHaveBeenCalled();
      expect(todos).toEqual({message:'Todos retrieved successfully',data:[mockTodo]});
    })
    });

    describe('getTodoById', () => {
      it('should return a todo',async ()=>{
        const todo=await todocontroller.getTodoById(mockTodo._id);
        expect(todoservice.getById).toHaveBeenCalledWith(mockTodo._id);
        expect(todo).toEqual({message:'Todo retrieved successfully',data:mockTodo});
      })
      it('should throw not found exception',async ()=>{
        await expect(todocontroller.getTodoById('1234567890')).rejects.toThrow(NotFoundException);
      })
    });

    describe('createTodo',()=>{
      it('should create a todo',async ()=>{
        const todo=await todocontroller.createTodo({title:'test'});
        expect(todoservice.create).toHaveBeenCalledWith('test');
        expect(todo).toEqual({message:'Todo created successfully',data:mockTodo});
      })
    })

    describe('updateTodo', () => {
      it('should update a todo', async () => {
        const updatedTodo = { ...mockTodo, completed: true };
    
        // Fix: Ensure mock service returns updated todo
        mockTodoservice.update.mockResolvedValue(updatedTodo);
    
        const todo = await todocontroller.updateTodo(mockTodo._id, { completed: true });
    
        expect(todoservice.update).toHaveBeenCalledWith(mockTodo._id, true);
    
        expect(todo).toEqual({
          message: 'Todo updated successfully',
          data: updatedTodo, // Now correctly matching the mock return value
        });
      });
    
      it('should throw not found exception', async () => {
        // Fix: Ensure mock service returns null for nonexistent ID
        mockTodoservice.update.mockResolvedValue(null);
    
        await expect(todocontroller.updateTodo('1234567890', { completed: true })).rejects.toThrow(NotFoundException);
      });
    });

    describe('deleteTodo',()=>{
      it('should delete a todo',async ()=>{
        const todo=await todocontroller.deleteTodo(mockTodo._id);      
        expect(todoservice.delete).toHaveBeenCalledWith(mockTodo._id);
        expect(todo).toEqual({message:'Todo deleted successfully',data:mockTodo});
      })
      it('should throw not found exception',async ()=>{
        mockTodoservice.delete.mockResolvedValue(null);
        await expect(todocontroller.deleteTodo('1234567890')).rejects.toThrow(NotFoundException);
      })
    })
  });
