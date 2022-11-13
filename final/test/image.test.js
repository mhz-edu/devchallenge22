const assert = require('assert');

const request = require('supertest');

const app = require('../src/app');
const images = require('./fixtures');

describe('POST image-input', () => {
  it('should return list of mines', async () => {
    const { body: response } = await request(app)
      .post('/api/image-input')
      .send({
        min_level: 95,
        image: images.image,
      })
      .expect('Content-Type', /application\/json/)
      .expect(200);

    assert.deepEqual(response, images.expected);
  });

  it('should return error for incorrect image', async () => {
    const { body: response } = await request(app)
      .post('/api/image-input')
      .send({ min_level: 50, image: 'test' })
      .expect('Content-Type', /application\/json/)
      .expect(422);

    assert.deepEqual(response.error, 'Validation error');
  });
});
