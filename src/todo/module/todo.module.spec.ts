// //using in-memory mongoDB mock
// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '../../app.module';
// import { connect, closeDatabase } from '../../../test/utils/mongo-memory-server'; 

// describe('TodoModule (API tests)', () => {
//   let app: INestApplication;
//   let todoId: string;

//   //added a function to create a sample todo and use it for tests (not ideal)
//   const sampleTodo= async ()=>{
//     const res=await request(app.getHttpServer()).post('/todos').send({ title: 'Integration Test Todo 2' });
//     todoId = res.body._id;
//   }
//   beforeAll(async () => {
//     await connect(); 

//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();

//     sampleTodo();
//   });

//   afterAll(async () => {
//     await app.close();
//     await closeDatabase(); 
//   });

//   //remove dependency of below tests on create todo tests

//   it('POST /todos - create todo', async () => {
//     const res = await request(app.getHttpServer())
//       .post('/todos')
//       .send({ title: 'Integration Test Todo 2' });

//     expect(res.status).toBe(201);
//     expect(res.body.title).toBe('Integration Test Todo 2');
//     // todoId = res.body._id;
//   });

//   it('GET /todos - get all todos', async () => {
//     const res = await request(app.getHttpServer()).get('/todos');
//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('GET /todos/:id - get todo by id', async () => {
//     const res = await request(app.getHttpServer()).get(`/todos/${todoId}`);

//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty('_id', todoId);
//     expect(res.body).toHaveProperty('title', 'Integration Test Todo 2');
//   });

//   it('GET /todos?status=completed - get completed todos', async () => {
//     const res = await request(app.getHttpServer()).get('/todos?status=completed');
//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('GET /todos?status=non-completed - get non-completed todos', async () => {
//     const res = await request(app.getHttpServer()).get('/todos?status=non-completed');
//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('PUT /todos/:id - update todo', async () => {
//     const res = await request(app.getHttpServer())
//       .put(`/todos/${todoId}`)
//       .send({ completed: true });

//     expect(res.status).toBe(200);
//     expect(res.body.completed).toBe(true);
//   });

//   it('DELETE /todos/:id - delete todo', async () => {
//     const res = await request(app.getHttpServer()).delete(`/todos/${todoId}`);
//     expect(res.status).toBe(200);
//   });
// });


import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { connect, closeDatabase } from '../../../test/utils/mongo-memory-server';

describe('TodoModule (Integration Tests)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await connect();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await closeDatabase();
  });

  it('POST /todos - should create a new todo', async () => {
    const res = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Create Test Todo' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Create Test Todo');
  });

  it('GET /todos - should return all todos', async () => {
    await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'List Test Todo' });

    const res = await request(app.getHttpServer()).get('/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /todos/:id - should return specific todo by id', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Get By ID Todo' });

    const id = createRes.body._id;

    const res = await request(app.getHttpServer()).get(`/todos/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', id);
    expect(res.body.title).toBe('Get By ID Todo');
  });

  it('GET /todos?status=completed - should return completed todos', async () => {
    await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Completed Todo', completed: true });

    const res = await request(app.getHttpServer()).get('/todos?status=completed');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /todos?status=non-completed - should return non-completed todos', async () => {
    await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Incomplete Todo', completed: false });

    const res = await request(app.getHttpServer()).get('/todos?status=non-completed');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /todos/:id - should update a todo', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Update Me' });

    const id = createRes.body._id;

    const updateRes = await request(app.getHttpServer())
      .put(`/todos/${id}`)
      .send({ completed: true });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.completed).toBe(true);
  });

  it('DELETE /todos/:id - should delete a todo', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Delete Me' });

    const id = createRes.body._id;

    const deleteRes = await request(app.getHttpServer()).delete(`/todos/${id}`);
    expect(deleteRes.status).toBe(200);
  });

  it('GET /todos/:id - should return 404 for non-existing todo', async () => {
    const res = await request(app.getHttpServer()).get('/todos/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });
});
