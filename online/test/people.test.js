const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');
const connection = require('../src/db');

describe('POST people', () => {
  it('should respond with 201 and created user', async () => {
    const user = { id: 'Harry', topics: ['Test'] };
    const { body: retUser } = await request(app)
      .post('/api/people')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    expect(retUser).to.deep.equal(user);
  });

  it('should respond with 422 if user with id already exists', async () => {
    const user = { id: 'John', topics: ['Test'] };
    await request(app).post('/api/people').send(user);

    await request(app)
      .post('/api/people')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });
  it('should respond with 422 if id is not string', async () => {
    const user = { id: 123, topics: ['Test'] };
    await request(app)
      .post('/api/people')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });
  it('should respond with 422 if topics contains non-string', async () => {
    const user = { id: 'Harry', topics: ['Test', 12] };
    await request(app)
      .post('/api/people')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });
});

describe('POST trust_connections', () => {
  const user = { id: 'Harry', topics: ['Test'] };

  before(async () => {
    await request(app).post('/api/people').send(user);
  });

  after(async () => {
    await connection.dropCollection('users');
  });

  it('should respond with 201 for existing user', async () => {
    const connections = { Ron: 2, Fred: 8 };

    const { body: retUser } = await request(app)
      .post(`/api/people/${user.id}/trust_connections`)
      .send(connections)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    expect(retUser).to.be.an('object');
    expect(retUser.name).to.be.equal(user.name);
    expect(retUser.topics).to.be.deep.equal(user.topics);
  });

  it('should respond with 422 for non-existing user', async () => {
    const connections = { Ron: 2, Fred: 8 };

    await request(app)
      .post(`/api/people/Fred/trust_connections`)
      .send(connections)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });

  it('should respond with 422 if trust level is not a number', async () => {
    const connections = { Ron: 'test', Fred: 8 };

    await request(app)
      .post(`/api/people/Harry/trust_connections`)
      .send(connections)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });
});
