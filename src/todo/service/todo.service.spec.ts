import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../service/todo.service';
import { Todo } from '../schema/todo.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
describe('TodoService', () => {
  let service: TodoService;
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

    service = module.get<TodoService>(TodoService);
    todomodel = module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Testing the TODO CRUD service', () => {
    //test for create todo
    describe('createTodofunc', () => {
      it('should create a todo', async () => {
        (todomodel.create as jest.Mock).mockResolvedValue(mocktodo);
        const result = await service.createTodofunc({
          title: 'test',
        });
        expect(todomodel.create).toHaveBeenCalledWith({
          title: 'test',
        });
        expect(result).toEqual(mocktodo);
      });
    });
    //test for get all todos
    describe('getAllTodosfunc', () => {
      it('should return all todos when no filter is provided', async () => {
        (todomodel.find as jest.Mock).mockResolvedValue([mocktodo]);

        const result = await service.getAllTodosfunc();

        expect(todomodel.find).toHaveBeenCalledWith();
        expect(result).toEqual([mocktodo]);
      });

      it('should return only completed todos when filter is "complete"', async () => {
        const completedTodo = { ...mocktodo, completed: true };
        (todomodel.find as jest.Mock).mockResolvedValue([completedTodo]);

        const result = await service.getAllTodosfunc('complete');

        expect(todomodel.find).toHaveBeenCalledWith({ completed: true });
        expect(result).toEqual([completedTodo]);
      });

      it('should return only incomplete todos when filter is "incomplete"', async () => {
        const incompleteTodo = { ...mocktodo, completed: false };
        (todomodel.find as jest.Mock).mockResolvedValue([incompleteTodo]);

        const result = await service.getAllTodosfunc('incomplete');

        expect(todomodel.find).toHaveBeenCalledWith({ completed: false });
        expect(result).toEqual([incompleteTodo]);
      });
    });

    //test for get todo by id
    describe('getTodoByIdfunc',()=>{
      it('should return a todo by id',async () =>{
        (todomodel.findById as jest.Mock).mockResolvedValue(mocktodo);
        const result = await service.getTodoByIdfunc(mocktodo._id);
        expect(todomodel.findById).toHaveBeenCalledWith(mocktodo._id);
        expect(result).toEqual(mocktodo);
      });
      it('should throw NotFoundException if todo not found', async () => {
        (todomodel.findById as jest.Mock).mockResolvedValue(null);
        await expect(service.getTodoByIdfunc(mocktodo._id)).rejects.toThrowError(
          `Todo with id ${mocktodo._id} not found`
        );
      });
    })

    //test for update todo by id
    describe('updateTodoByIdfunc',()=>{
      it('should update a todo by id', async ()=>{
        const updatedTodo = { ...mocktodo, completed:true };
        (todomodel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTodo);
        const result = await service.updateTodoByIdfunc(mocktodo._id, { completed: true });
        expect(todomodel.findByIdAndUpdate).toHaveBeenCalledWith(mocktodo._id, { completed: true }, { new: true });
        expect(result).toEqual(updatedTodo);
      })

      it('should throw NotFoundException if todo not found', async () => {
        (todomodel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
        await expect(service.updateTodoByIdfunc(mocktodo._id, { completed: true })).rejects.toThrowError(
          `Todo with id ${mocktodo._id} not found`
        );
      });
    })

    //test for delete todo by id
    describe('deleteTodoByIdfunc',()=>{
      it('should delete a todo by id', async()=>{
        (todomodel.findByIdAndDelete as jest.Mock).mockResolvedValue(mocktodo);
        const todo= await service.deleteTodoByIdfunc(mocktodo._id);
        expect(todomodel.findByIdAndDelete).toHaveBeenCalledWith(mocktodo._id);
        expect (todo).toEqual(mocktodo);
      })

      it('should throw NotFoundException if todo not found', async () => {
        (todomodel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
        await expect(service.deleteTodoByIdfunc(mocktodo._id)).rejects.toThrowError(
          `Todo with id ${mocktodo._id} not found`
        );
      });
    })
  });
});
