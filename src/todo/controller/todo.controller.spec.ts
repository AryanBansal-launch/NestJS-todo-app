import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../controller/todo.controller';
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
    createTodofunc: jest.fn().mockResolvedValue(mockTodo),
    getAllTodosfunc: jest.fn().mockResolvedValue([mockTodo]),
    getTodoByIdfunc: jest.fn(),
    updateTodoByIdfunc: jest.fn(),
    deleteTodoByIdfunc: jest.fn()
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

  describe('Testing the TODO CRUD controller',()=>{
    //test for create todo
    describe('createTodo',()=>{
      it('should create a todo', async ()=>{
        const mockCreateTodoDto = { title: 'test' };
        const result = await controller.createTodo(mockCreateTodoDto);
        expect(service.createTodofunc).toHaveBeenCalledWith(mockCreateTodoDto);
        expect(result).toEqual(mockTodo);
      })
    })

    //Tests for get all todos
    describe('getAllTodos', ()=>{
      it('should return all todos', async ()=>{
        (service.getTodoByIdfunc as jest.Mock).mockResolvedValue([mockTodo]);
        const result = await controller.getAllTodos();
        expect(service.getAllTodosfunc).toHaveBeenCalled();
        expect(result).toEqual([mockTodo]);
      })

      it('should return completed todos', async ()=>{
        const mockcompletedTodo = { ...mockTodo, completed: true };
        (service.getAllTodosfunc as jest.Mock).mockResolvedValue([mockcompletedTodo]);
        const result = await controller.getAllTodos('complete');
        expect(service.getAllTodosfunc).toHaveBeenCalledWith('complete');
        expect(result).toEqual([mockcompletedTodo]);
      })

      it('should return non-completed todos', async ()=>{
        const mocknoncompletedTodo = { ...mockTodo, completed: false };
        (service.getAllTodosfunc as jest.Mock).mockResolvedValue([mocknoncompletedTodo]);
        const result = await controller.getAllTodos('complete');
        expect(service.getAllTodosfunc).toHaveBeenCalledWith('complete');
        expect(result).toEqual([mocknoncompletedTodo]);
      })
    })

    //test for get todo by id
    describe('getTodoById',()=>{
      it('should return a todo by id', async ()=>{
        (service.getTodoByIdfunc as jest.Mock).mockResolvedValue(mockTodo);
        const result = await controller.getTodoById(mockTodo._id);
        expect(service.getTodoByIdfunc).toHaveBeenCalledWith(mockTodo._id);
        expect(result).toEqual(mockTodo);
      })
      it('should throw NotFoundException if todo not found', async ()=>{
       mockTodoService.getTodoByIdfunc.mockRejectedValue(new NotFoundException(`Todo with id ${mockTodo._id} not found`));
       await expect(controller.getTodoById('invalidId')).rejects.toThrow(NotFoundException);
      })
    })
  })
});
