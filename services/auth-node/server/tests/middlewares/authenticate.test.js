require('../../config/environments');
require('../../db/mongoose');

const _ = require('lodash');

const { authenticate } = require('../../middlewares/authenticate');
const { User } = require('../../models/user');
const { users, populateUsers } = require('../factories/user');

const res = { status: jest.fn((code) => { return { send: jest.fn() } })};
const next = jest.fn();

beforeEach(async () => {
  await User.remove({});
});

describe('Server', () => {
  describe('Middlewares', () => {
    describe('Authenticate', () => {

      beforeEach(populateUsers);

      describe('Success', () => {
        it('sets the req.user and req.token', async () => {
          const token = _.last(users[0].tokens).token;
          const req = { header: jest.fn((attr) => token) };
          await authenticate(req, res, next);

          expect(req.user.first_name).toEqual(users[0].first_name);
          expect(req.user.last_name).toEqual(users[0].last_name);
          expect(req.user.email).toEqual(users[0].email);
          expect(req.token).toBe(token);
        });
      });

      describe('Error', () => {
        it('calls res.status with a 401', async () => {
          const req = { header: jest.fn((attr) => 'abc123') };
          const spy = jest.spyOn(res, 'status');
          await authenticate(req, res, next);

          expect(spy).toHaveBeenCalledWith(401);
        })
      });

    });

  });
});
