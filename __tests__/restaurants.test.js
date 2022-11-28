const setup = require('../data/setup');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
// const UserService = require('../lib/services/UserService'); depending if I put in the reviews testing here as well

describe('restaurant routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  test('GET /api/v1/restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.body.length).toEqual(4);
    expect(res.body[0]).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      cuisine: expect.any(String),
      cost: expect.any(Number),
      image: expect.any(String),
    });
  });

  test('GET /api/v1/restaurants/:id', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.body).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      cuisine: expect.any(String),
      cost: expect.any(Number),
      image: expect.any(String),
    });
    expect(res.status).toBe(200);
  });
});
