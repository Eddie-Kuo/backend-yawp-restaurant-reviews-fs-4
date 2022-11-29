const setup = require('../data/setup');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('restaurant routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });
  const mockUser = {
    email: 'mockUser@testing.com',
    password: '123456',
    firstName: 'Mock',
    lastName: 'U',
  };

  const registerAndLogin = async () => {
    const agent = request.agent(app);
    const user = await UserService.create(mockUser);
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: mockUser.email, password: mockUser.password });
    return [agent, user];
  };

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

  test('POST /api/v1/restaurants/:restId/reviews', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent
      .post('/api/v1/restaurants/1/reviews')
      .send({ stars: 5, detail: 'It was okay' });
    expect(res.status).toBe(200);
  });
});
