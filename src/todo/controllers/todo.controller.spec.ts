import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from '../service/todo.service';
import { NotFoundException } from '@nestjs/common';

describe('todoController', () => {
  let todoController: TodoController;
  let todoservice:TodoService;

  const mockTodo = {
    _id: '65f1234567890abcdef12345',
    title: 'test',
    completed: false,
  };
  const mockTodoService = {
    getAll: jest.fn().mockResolvedValue([mockTodo]),
    getById: jest.fn().mockImplementation((id) => {
      return id === mockTodo._id ? Promise.resolve(mockTodo) : Promise.resolve(null);
    }),
    create: jest.fn().mockResolvedValue(mockTodo),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue(mockTodo),
  };
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
      controllers: [TodoController],
      providers: [{ provide: TodoService, useValue: mockTodoService },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoservice = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
  });

  describe('getAllTodos', () => {
    it('should return all todos', async () => {
      const todos=await todoController.getAllTodos();
      expect(todoservice.getAll).toHaveBeenCalled();
      expect(todos).toEqual([mockTodo]);
    })
    });

    describe('getTodoById', () => {
      it('should return a todo',async ()=>{
        const todo=await todoController.getTodoById(mockTodo._id);
        expect(todoservice.getById).toHaveBeenCalledWith(mockTodo._id);
        expect(todo).toEqual(mockTodo);
      })
      it('should throw NotFoundException when todo not found by id', async () => {
        mockTodoService.getById.mockRejectedValue(new NotFoundException('Todo not found'));
      
        await expect(todoController.getTodoById('invalidId')).rejects.toThrow(NotFoundException);
      });
      
    });

    describe('createTodo',()=>{
      it('should create a todo',async ()=>{
        const todo=await todoController.createTodo({title:'test'});
        expect(todoservice.create).toHaveBeenCalledWith('test');
        expect(todo).toEqual(mockTodo);
      })
    })

    describe('updateTodo', () => {
      it('should update a todo', async () => {
        const updatedTodo = { ...mockTodo, completed: true };
        mockTodoService.update.mockResolvedValue(updatedTodo);
    
        const todo = await todoController.updateTodo(mockTodo._id, { completed: true });
    
        expect(todoservice.update).toHaveBeenCalledWith(mockTodo._id, true);
    
        expect(todo).toEqual(
          updatedTodo, 
        );
      });
    
      it('should throw NotFoundException when updating a non-existent todo', async () => {
        const dto = { completed: true };
        mockTodoService.update.mockRejectedValue(new NotFoundException('Todo Not found'));
      
        await expect(todoController.updateTodo('invalidId', dto)).rejects.toThrow(NotFoundException);
      });
      
    });

    describe('deleteTodo',()=>{
      it('should delete a todo',async ()=>{
        const todo=await todoController.deleteTodo(mockTodo._id);      
        expect(todoservice.delete).toHaveBeenCalledWith(mockTodo._id);
        expect(todo).toEqual(mockTodo);
      })
      it('should throw NotFoundException when deleting a non-existent todo', async () => {
        mockTodoService.delete.mockRejectedValue(new NotFoundException('Todo Not Found'));
      
        await expect(todoController.deleteTodo('invalidId')).rejects.toThrow(NotFoundException);
      });
      
    })
  });