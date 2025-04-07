import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../app.module';
import { disconnect } from 'mongoose';

describe('TodoController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  let todoId: string;

  it('POST /todos - create todo', async () => {
    const res = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Integration Test Todo 2' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Integration Test Todo 2');
    todoId = res.body._id;
  });

  it('GET /todos - get all todos', async () => {
    const res = await request(app.getHttpServer()).get('/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /todos/:id - get todo by id', async () => {
    const res = await request(app.getHttpServer()).get(`/todos/${todoId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', todoId);
    expect(res.body).toHaveProperty('title', 'Integration Test Todo 2');
  });
  it('GET /todos?status=completed - get completed todos', async () => {
    const res = await request(app.getHttpServer()).get(
      '/todos?status=completed',
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('GET /todos?status=non-completed - get non-completed todos', async () => {
    const res = await request(app.getHttpServer()).get(
      '/todos?status=non-completed',
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /todos/:id - update todo', async () => {
    const res = await request(app.getHttpServer())
      .put(`/todos/${todoId}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('DELETE /todos/:id - delete todo', async () => {
    const res = await request(app.getHttpServer()).delete(`/todos/${todoId}`);
    expect(res.status).toBe(200);
  });
});
