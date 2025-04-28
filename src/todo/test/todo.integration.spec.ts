import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoSchema } from '../schema/todo.schema';
import { TodoService } from '../service/todo.service';
import { TodoController } from '../controller/todo.controller';
import { Todo } from '../schema/todo.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';


describe('TodoController Tests', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
  
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]), 
      ],
      controllers: [TodoController],
      providers: [TodoService],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
//   afterAll(async () => {
//     await app.close();
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//     if(mongod)await mongod.stop();
//   });

  it('/todos (POST) - should create a new todo', async () => {
    const newTodo = {
      title: 'Test Todo',
      completed: false,
    };

    const response = await request(app.getHttpServer())
      .post('/todo')
      .send(newTodo)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe(newTodo.title);
  });

  it('/todos (GET) - should fetch all todos', async () => {
    const response = await request(app.getHttpServer())
      .get('/todo')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/todos/:id (GET) - should fetch a single todo by ID', async () => {
    const newTodo = { title: 'Single Todo', completd: false };

    // Create a todo first
    const createdTodo = await request(app.getHttpServer())
      .post('/todo')
      .send(newTodo)
      .expect(201);

    const todoId = createdTodo.body._id;

    // Fetch the created todo
    const response = await request(app.getHttpServer())
      .get(`/todo/${todoId}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', todoId);
    expect(response.body.title).toBe(newTodo.title);
  });

  it('/todo/:id (DELETE) - should delete a todo by ID', async () => {
    const newTodo = { title: 'Todo to Delete', description: 'Will be deleted' };

    // Create a todo first
    const createdTodo = await request(app.getHttpServer())
      .post('/todo')
      .send(newTodo)
      .expect(201);

    const todoId = createdTodo.body._id;

    // Delete the created todo
    await request(app.getHttpServer())
      .delete(`/todo/${todoId}`)
      .expect(200);

    // Try fetching the deleted todo
    await request(app.getHttpServer())
      .get(`/todo/${todoId}`)
      .expect(404);
  });
});