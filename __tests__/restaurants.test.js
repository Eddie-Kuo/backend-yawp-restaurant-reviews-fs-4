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

  //   const masterLogin = async () => {
  //     const adminAgent = request.agent(app);
  //     const admin = await UserService.signIn(mockUser);
  //     await admin
  //       .post('/api/v1/users/sessions')
  //       .send({ email: mockUser.email, password: mockUser.password });
  //     return [adminAgent, admin];
  //   };

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

  // log in the user
  // have the user send in a review
  // then check if that user can also delete the review they just sent
  test('DELETE /api/v1/reviews/:id', async () => {
    // const agent = await request.agent(app);
    // await agent
    //   .post('/api/v1/users/sessions')
    //   .send({ email: mockUser.email, password: mockUser.password });
    const [agent] = await registerAndLogin();
    await agent
      .post('/api/v1/restaurants/1/reviews')
      .send({ stars: 5, detail: 'It was really good' });
    const res = await agent.delete('/api/v1/reviews/4');
    expect(res.status).toBe(204);
  });
});

// {
//     "email": "mockUser@testing.com",
//     "password": "123456",
//     "firstName": "Mock",
//     "lastName": "U"
// }

// {
//     "stars": "100",
//     "detail": "it was really goodddd"
// }
