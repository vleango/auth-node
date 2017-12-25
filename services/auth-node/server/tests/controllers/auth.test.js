const request = require('supertest');
const app = require('../../app');
const _ = require('lodash');

const { User } = require('../../models/user');
const { users, populateUsers } = require('../factories/user');

beforeEach(async () => {
  await User.remove({});
});

let response;

describe('Server', () => {
  describe('Controllers', () => {
    describe('Auth', () => {
      describe('POST /register', () => {
        const REGISTER_URL = '/api/auth/register';

        describe('Success', () => {
          beforeEach(async () => {
            response = await request(app)
              .post(REGISTER_URL)
              .send(users[0]);
          });

          it('should return a 200 status', () => {
            expect(response.statusCode).toBe(200);
          });

          it('should return a token as x-auth in header', async () => {
            const user = await User.findById(response.body._id);
            expect(response.headers).toHaveProperty('x-auth', _.last(user.tokens).token);
          });

          it('should return an id, email, and access in body', () => {
            expect(response.body).toHaveProperty("_id");
            expect(response.body).toHaveProperty("email", users[0].email);
          });
        });

        describe('Error', () => {
          describe('Invalid params', () => {
            it('should return a 400 status', () => {
              ['email', 'first_name', 'last_name', 'password'].forEach(async (param) => {
                response = await request(app)
                  .post(REGISTER_URL)
                  .send({...users[0], [param]: ''});
                expect(response.statusCode).toBe(400);
              });
            });
          });

        });
      });

      describe('POST /login', () => {
        const LOGIN_URL = '/api/auth/login';
        beforeEach(populateUsers);

        describe('Success', () => {
          const spy = jest.spyOn(User, 'findByCredentials');

          beforeEach(async () => {
            response = await request(app)
              .post(LOGIN_URL)
              .send(users[0]);
          });

          it('should call findByCredentials with valid params', () => {
            let body = _.pick(users[0], 'email', 'password');
            expect(spy).toHaveBeenLastCalledWith(body.email, body.password);
          });

          it('should return a 200 status', () => {
            expect(response.statusCode).toBe(200);
          });

          it('should return a token as x-auth in header', async () => {
            const user = await User.findById(response.body._id)
            expect(response.headers).toHaveProperty('x-auth', _.last(user.tokens).token);
          });

          it('should return an id, email, and auth in the body', () => {
            expect(response.body).toHaveProperty("_id");
            expect(response.body).toHaveProperty("email", users[0].email);
          });
        });

        describe('Error', () => {
          describe('Invalid params', () => {
            it('should return a 400 status', () => {
              ['email', 'password'].forEach(async (param) => {
                response = await request(app)
                  .post(LOGIN_URL)
                  .send({...users[0], [param]: ''});
                expect(response.statusCode).toBe(400);
              });
            });
          });
        });
      });

      describe('POST /provider', () => {
        beforeEach(populateUsers);
        const PROVIDER_URL = '/api/auth/provider';
        const params = {
          accessToken: "abc123",
          email: "bob@tester.com",
          first_name: 'Bob',
          last_name: 'Hope',
          name: "Bob Hope",
          userID: "1234",
          access: 'facebook'
        };

        describe('calling generateAuthToken', () => {
          it('should call generateAuthToken with valid params', async () => {
            const spy = spyOn(User.prototype, 'generateAuthToken');
            User.authFromProvider = jest.fn(async (body) => await User.findOne({email: users[0].email}));
            response = await request(app)
              .post(PROVIDER_URL)
              .send(params);
            expect(spy).toHaveBeenCalledWith(params.access);
          });
        });

        describe('Success', () => {
          beforeEach(async () => {
            User.authFromProvider = jest.fn(async (body) => await User.findOne({email: users[0].email}));

            response = await request(app)
              .post(PROVIDER_URL)
              .send(params);
          });

          it('should call authFromProvider with valid params', () => {
            let body = _.omit(params, 'name');
            expect(User.authFromProvider).toHaveBeenLastCalledWith(body);
          });

          it('should return a 200 status', () => {
            expect(response.statusCode).toBe(200);
          });

          it('should return a token as x-auth in header', async () => {
            const user = await User.findById(response.body._id)
            expect(response.headers).toHaveProperty('x-auth', _.last(user.tokens).token);
          });

          it('should return an id, email, and auth in the body', () => {
            expect(response.body).toHaveProperty("_id");
            expect(response.body).toHaveProperty("email", users[0].email);
          });
        });

        describe('Error', () => {
          describe('Invalid params', () => {
            it('should return a 400 status', () => {
              ['email', 'first_name', 'last_name', 'accessToken', 'userID'].forEach(async (param) => {
                response = await request(app)
                  .post(PROVIDER_URL)
                  .send({...users[0], [param]: ''});
                expect(response.statusCode).toBe(400);
              });
            });
          });
        });
      });

      describe('DELETE /logout', () => {
        const LOGOUT_URL = '/api/auth/logout';
        beforeEach(populateUsers);

        describe('Success', () => {
          beforeEach(async () => {
            response = await request(app)
             .delete(LOGOUT_URL)
             .set('x-auth', users[0].tokens[0].token)
          });

          it('should return a 200 status', () => {
            expect(response.statusCode).toBe(200);
          });
        });

        describe('Error', () => {
          beforeEach(async () => {

            // mock for authenticate middleware
            User.findByToken = jest.fn((token) => 'fakeuser');

            response = await request(app)
             .delete(LOGOUT_URL)
             .set('x-auth', '123abc')
          });

          it('should return a 400 status', () => {
            expect(response.statusCode).toBe(400);
          });
        });
      });

    });
  });

});
