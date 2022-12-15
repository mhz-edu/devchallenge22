const assert = require('assert');

const request = require('supertest');

const app = require('../src/app');
const { destroyWorkers } = require('../src/worker/workerPool');
const images = require('./fixtures');
const { generateMultiCell } = require('./image.factory');

describe('POST image-input', () => {
  after(async () => {
    destroyWorkers();
  });

  it('should return list of mines', async () => {
    const { body: response } = await request(app)
      .post('/api/image-input')
      .send({
        min_level: 90,
        image: images.image,
      })
      .expect('Content-Type', /application\/json/)
      .expect(200);

    assert.deepEqual(response, images.expected);
  });

  it.skip('should return single detetected mine in the first cell of single cell image', async () => {
    // single cell is not supported by grid detection
    const { body: response } = await request(app)
      .post('/api/image-input')
      .send({
        min_level: 95,
        image: `data:image/gif;base64,${(
          await generateMultiCell(20, [98], 1, 1)
        ).toString('base64')}`,
      })
      .expect('Content-Type', /application\/json/)
      .expect(200);

    assert.deepEqual(response, { mines: [{ x: 0, y: 0, level: 98 }] });
  });

  it('should return single detected mine in the middle cell of three cell image', async () => {
    const { body: response } = await request(app)
      .post('/api/image-input')
      .send({
        min_level: 95,
        image: `data:image/gif;base64,${(
          await generateMultiCell(20, [50, 100, 93], 3, 1)
        ).toString('base64')}`,
      })
      .expect('Content-Type', /application\/json/)
      .expect(200);

    assert.deepEqual(response, { mines: [{ x: 1, y: 0, level: 100 }] });
  });

  it('should return two detected mines of 3x3 cell image', async () => {
    const { body: response } = await request(app)
      .post('/api/image-input')
      .send({
        min_level: 95,
        image: `data:image/gif;base64,${(
          await generateMultiCell(20, [50, 100, 93, 0, 25, 14, 96, 0, 0], 3, 3)
        ).toString('base64')}`,
      })
      .expect('Content-Type', /application\/json/)
      .expect(200);

    assert.deepEqual(response, {
      mines: [
        { x: 1, y: 0, level: 100 },
        { x: 0, y: 2, level: 96 },
      ],
    });
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
