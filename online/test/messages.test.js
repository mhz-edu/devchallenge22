const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');
const User = require('../src/model/people');
const connection = require('../src/db');

describe('POST messages', () => {
  before(async () => {
    const users = [
      {
        id: 'Harry',
        topics: ['magic'],
        connections: new Map(
          Object.entries({ Hermione: 10, Ron: 10, Snape: 4 })
        ),
      },
      {
        id: 'Hermione',
        topics: ['magic', 'books'],
        connections: new Map(Object.entries({ Greg: 6 })),
      },
      {
        id: 'Ron',
        topics: ['snacks', 'books'],
        connections: new Map(Object.entries({ Ginny: 10 })),
      },
      {
        id: 'Ginny',
        topics: ['books'],
        connections: new Map(Object.entries({})),
      },
      {
        id: 'Greg',
        topics: ['books'],
        connections: new Map(Object.entries({})),
      },
      {
        id: 'Malfoy',
        topics: ['magic'],
        connections: new Map(Object.entries({ Greg: 7 })),
      },
      {
        id: 'Snape',
        topics: ['poisons', 'books'],
        connections: new Map(Object.entries({ Malfoy: 6, Beatrice: 8 })),
      },
      {
        id: 'Beatrice',
        topics: ['books'],
        connections: new Map(Object.entries({})),
      },
    ];
    await User.create(users);
  });

  after(async () => {
    await connection.dropCollection('users');
  });

  it('should send broadcast message to users with required trust or above', async () => {
    const message = {
      text: 'Test',
      topics: ['books'],
      from_person_id: 'Harry',
      min_trust_level: 5,
    };

    const { body: response } = await request(app)
      .post('/api/messages')
      .send(message)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    expect(response).to.deep.equal({
      Harry: ['Hermione', 'Ron'],
      Hermione: ['Greg'],
      Ron: ['Ginny'],
    });
  });

  it('should send broadcast message to users with all required topics', async () => {
    const message = {
      text: 'Test2',
      topics: ['books', 'magic'],
      from_person_id: 'Harry',
      min_trust_level: 1,
    };

    const { body: response } = await request(app)
      .post('/api/messages')
      .send(message)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    expect(response).to.deep.equal({ Harry: ['Hermione'] });
  });

  it('should return 422 for non-string topics', async () => {
    const message = {
      text: 'Test2',
      topics: ['books', 'magic', 123],
      from_person_id: 'Harry',
      min_trust_level: 1,
    };

    await request(app)
      .post('/api/messages')
      .send(message)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });

  it('should return 422 for non-string text', async () => {
    const message = {
      text: 123,
      topics: ['books', 'magic'],
      from_person_id: 'Harry',
      min_trust_level: 1,
    };

    await request(app)
      .post('/api/messages')
      .send(message)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });

  it('should return 422 for invalid trust level', async () => {
    const message = {
      text: 'Test message',
      topics: ['books', 'magic'],
      from_person_id: 'Harry',
      min_trust_level: 100,
    };

    await request(app)
      .post('/api/messages')
      .send(message)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });

  it('should return 422 for non-existing person id', async () => {
    const message = {
      text: 'Test message',
      topics: ['books', 'magic'],
      from_person_id: 'Batman',
      min_trust_level: 5,
    };

    await request(app)
      .post('/api/messages')
      .send(message)
      .expect('Content-Type', /application\/json/)
      .expect(422);
  });
});
