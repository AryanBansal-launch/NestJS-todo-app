import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from '../service/todo.service';

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
      providers: [{ provide: TodoService, useValue: mockTodoservice },
      ],
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
      expect(todos).toEqual([mockTodo]);
    })
    });

    describe('getTodoById', () => {
      it('should return a todo',async ()=>{
        const todo=await todocontroller.getTodoById(mockTodo._id);
        expect(todoservice.getById).toHaveBeenCalledWith(mockTodo._id);
        expect(todo).toEqual(mockTodo);
      })
      it('should handle errors gracefully', async () => {
        mockTodoservice.getById.mockRejectedValue({
          status: 404,
          response: { message: 'Not Found' },
        });
  
        expect(await todocontroller.getTodoById('999')).toEqual({
          status: 404,
          message: 'Not Found',
        });
      });
    });

    describe('createTodo',()=>{
      it('should create a todo',async ()=>{
        const todo=await todocontroller.createTodo({title:'test'});
        expect(todoservice.create).toHaveBeenCalledWith('test');
        expect(todo).toEqual(mockTodo);
      })
    })

    describe('updateTodo', () => {
      it('should update a todo', async () => {
        const updatedTodo = { ...mockTodo, completed: true };
        mockTodoservice.update.mockResolvedValue(updatedTodo);
    
        const todo = await todocontroller.updateTodo(mockTodo._id, { completed: true });
    
        expect(todoservice.update).toHaveBeenCalledWith(mockTodo._id, true);
    
        expect(todo).toEqual(
          updatedTodo, 
        );
      });
    
      it('should handle errors during update', async () => {
        mockTodoservice.update.mockRejectedValue({
          status: 404,
          response: { message: 'Not Found' },
        });
  
        expect(await todocontroller.updateTodo('999', { completed: true })).toEqual({
          status: 404,
          message: 'Not Found',
        });
      });
    });

    describe('deleteTodo',()=>{
      it('should delete a todo',async ()=>{
        const todo=await todocontroller.deleteTodo(mockTodo._id);      
        expect(todoservice.delete).toHaveBeenCalledWith(mockTodo._id);
        expect(todo).toEqual(mockTodo);
      })
      it('should handle errors during delete', async () => {
        mockTodoservice.delete.mockRejectedValue({
          status: 404,
          response: { message: 'Not Found' },
        });
  
        expect(await todocontroller.deleteTodo('999')).toEqual({
          status: 404,
          message: 'Not Found',
        });
      });
    })
  });