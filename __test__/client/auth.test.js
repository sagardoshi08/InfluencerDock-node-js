/**
 * auth.test.js
 * @description :: contains test cases of APIs for authentication module.
 */

const dotenv = require('dotenv');

dotenv.config();
process.env.NODE_ENV = 'test';
const db = require('mongoose');
const request = require('supertest');
const {
  MongoClient, ObjectId,
} = require('mongodb');
const app = require('../../app.js');
const authConstant = require('../../constants/authConstant');

const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let insertedUser = {};

/**
 * @description : model dependencies resolver
 */
beforeAll(async () => {
  try {
    await client.connect();
    const db = client.db('InfluencerDock_test');

    const user = db.collection('user');
    insertedUser = await user.insertOne({
      username: 'Hugh_Schaefer',
      password: 'MuM69mpHcHR6blz',
      email: 'Sheldon.Lueilwitz49@gmail.com',
      name: 'Bryant Bechtelar',
      role: 120,
      resetPasswordLink: {},
      loginRetryLimit: 856,
      loginReactiveTime: '2025-01-14T21:00:08.844Z',
      id: '6669a776269fe4b4e1988b7e',
    });
  } catch (err) {
    console.error(`we encountered ${err}`);
  } finally {
    client.close();
  }
});

// test cases

describe('POST /register -> if email and username is given', () => {
  test('should register a user', async () => {
    const registeredUser = await request(app)
      .post('/client/auth/register')
      .send({
        username: 'Aubrey81',
        password: 'jPyaFw45xsMqfFG',
        email: 'Elody69@yahoo.com',
        name: 'Lola Stoltenberg',
        addedBy: insertedUser.insertedId,
        role: authConstant.USER_ROLE.User,
      });
    expect(registeredUser.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(registeredUser.body.status).toBe('SUCCESS');
    expect(registeredUser.body.data).toMatchObject({ id: expect.any(String) });
    expect(registeredUser.statusCode).toBe(200);
  });
});

describe('POST /login -> if username and password is correct', () => {
  test('should return user with authentication token', async () => {
    const user = await request(app)
      .post('/client/auth/login')
      .send(
        {
          username: 'Elody69@yahoo.com',
          password: 'jPyaFw45xsMqfFG',
        },
      );
    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('SUCCESS');
    expect(user.body.data).toMatchObject({
      id: expect.any(String),
      token: expect.any(String),
    });
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /login -> if username is incorrect', () => {
  test('should return unauthorized status and user not exists', async () => {
    const user = await request(app)
      .post('/client/auth/login')
      .send(
        {
          username: 'wrong.username',
          password: 'jPyaFw45xsMqfFG',
        },
      );

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(400);
  });
});

describe('POST /login -> if password is incorrect', () => {
  test('should return unauthorized status and incorrect password', async () => {
    const user = await request(app)
      .post('/client/auth/login')
      .send(
        {
          username: 'Elody69@yahoo.com',
          password: 'wrong@password',
        },
      );

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(400);
  });
});

describe('POST /login -> if username or password is empty string or has not passed in body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    const user = await request(app)
      .post('/client/auth/login')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.body.message).toBe('Insufficient parameters');
    expect(user.statusCode).toBe(400);
  });
});

describe('POST /forgot-password -> if email has not passed from request body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    const user = await request(app)
      .post('/client/auth/forgot-password')
      .send({ email: '' });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.body.message).toBe('Insufficient parameters');
    expect(user.statusCode).toBe(400);
  });
});

describe('POST /forgot-password -> if email passed from request body is not available in database ', () => {
  test('should return record not found status', async () => {
    const user = await request(app)
      .post('/client/auth/forgot-password')
      .send({ email: 'unavailable.email@hotmail.com' });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('RECORD_NOT_FOUND');
    expect(user.body.message).toBe('Record not found with specified criteria.');
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /forgot-password -> if email passed from request body is valid and OTP sent successfully', () => {
  test('should return success message', async () => {
    const expectedOutputMessages = [
      'Reset password link successfully send.',
      'Reset password link successfully send to your email.',
      'Reset password link successfully send to your mobile number.',
    ];
    const user = await request(app)
      .post('/client/auth/forgot-password')
      .send({ email: 'Elody69@yahoo.com' });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('SUCCESS');
    expect(expectedOutputMessages).toContain(user.body.message);
    expect(user.statusCode).toBe(200);
  });
});

describe('POST /validate-otp -> otp is sent in request body and OTP is correct', () => {
  test('should return success', () => request(app)
    .post('/client/auth/login')
    .send(
      {
        username: 'Elody69@yahoo.com',
        password: 'jPyaFw45xsMqfFG',
      },
    ).then((login) => () => request(app)
      .get(`/client/api/v1/user/${login.body.data.id}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${login.body.data.token}`,
      }).then((foundUser) => request(app)
        .post('/client/auth/validate-otp')
        .send({ otp: foundUser.body.data.resetPasswordLink.code }).then((user) => {
          expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
          expect(user.body.status).toBe('SUCCESS');
          expect(user.statusCode).toBe(200);
        }))));
});

describe('POST /validate-otp -> if OTP is incorrect or OTP has expired', () => {
  test('should return invalid OTP', async () => {
    const user = await request(app)
      .post('/client/auth/validate-otp')
      .send({ otp: '12334' });
    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('FAILURE');
    expect(user.statusCode).toBe(200);
    expect(user.body.message).toBe('Invalid OTP');
  });
});

describe('POST /validate-otp -> if request body is empty or otp has not been sent in body', () => {
  test('should return insufficient parameter', async () => {
    const user = await request(app)
      .post('/client/auth/validate-otp')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(400);
  });
});

describe('PUT /reset-password -> code is sent in request body and code is correct', () => {
  test('should return success', () => request(app)
    .post('/client/auth/login')
    .send(
      {
        username: 'Elody69@yahoo.com',
        password: 'jPyaFw45xsMqfFG',
      },
    ).then((login) => () => request(app)
      .get(`/client/api/v1/user/${login.body.data.id}`)
      .set({
        Accept: 'application/json',
        Authorization: `Bearer ${login.body.data.token}`,
      }).then((foundUser) => request(app)
        .put('/client/auth/validate-otp')
        .send({
          code: foundUser.body.data.resetPasswordLink.code,
          newPassword: 'newPassword',
        }).then((user) => {
          expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
          expect(user.body.status).toBe('SUCCESS');
          expect(user.statusCode).toBe(200);
        }))));
});

describe('PUT /reset-password -> if request body is empty or code/newPassword is not given', () => {
  test('should return insufficient parameter', async () => {
    const user = await request(app)
      .put('/client/auth/reset-password')
      .send({});

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('BAD_REQUEST');
    expect(user.statusCode).toBe(400);
  });
});

describe('PUT /reset-password -> if code is invalid', () => {
  test('should return invalid code', async () => {
    const user = await request(app)
      .put('/client/auth/reset-password')
      .send({
        code: '123',
        newPassword: 'testPassword',
      });

    expect(user.headers['content-type']).toEqual('application/json; charset=utf-8');
    expect(user.body.status).toBe('FAILURE');
    expect(user.body.message).toBe('Invalid Code');
    expect(user.statusCode).toBe(200);
  });
});

afterAll((done) => {
  db.connection.db.dropDatabase(() => {
    db.connection.close(() => {
      done();
    });
  });
});
