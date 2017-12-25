require('../../config/environments');
require('../../db/mongoose');

const axios = require('axios');
const _ = require('lodash');

const { User, ACCESS_TYPES, AUTH_FAIL_MSG, FAILED_TOKEN_MSG } = require('../../models/user');
const { users, populateUsers } = require('../factories/user');

beforeEach(async () => {
  await User.remove({});
});

// unmocking
const originalIsAuthorizedByProvider = User.isAuthorizedByProvider;
afterEach(() => {
  User.isAuthorizedByProvider = originalIsAuthorizedByProvider;
});

describe('Server', () => {
  describe('Models', () => {
    describe('User', () => {

      describe('schema', () => {
        describe('first_name', () => {
          it('should trim white spaces', async () => {
            const user = await new User({ ...users[0], first_name: ' Tester ' }).save();
            expect(user.first_name).toBe('Tester');
          });

          it('should have length >= 1', async () => {
            try {
              const user = await new User({ ...users[0], first_name: '' }).save();
              expect('should not come here').toEqual('here');
            }
            catch(err) { expect(err.message).toBe('User validation failed: first_name: Path `first_name` is required.') }
          });
        });

        describe('last_name', () => {
          it('should trim white spaces', async () => {
            const user = await new User({ ...users[0], last_name: ' Tester ' }).save();
            expect(user.last_name).toBe('Tester');
          });

          it('should have length >= 1', async () => {
            try {
              const user = await new User({ ...users[0], last_name: '' }).save();
              expect('should not come here').toEqual('here');
            }
            catch(err) { expect(err.message).toBe('User validation failed: last_name: Path `last_name` is required.') }
          });
        });

        describe('email', () => {
          it('should trim white spaces', async () => {
            const user = await new User({ ...users[0], email: ' test@example.com ' }).save();
            expect(user.email).toBe('test@example.com');
          });

          it('should have length >= 1', async () => {
            try {
              const user = await new User({ ...users[0], email: '' }).save();
              expect('should not come here').toEqual('here');
            }
            catch(err) { expect(err.message).toBe('User validation failed: email: Path `email` is required.') }
          });

          it('should be unique', async () => {
            await new User(users[0]).save();
            try {
              await new User(users[0]).save();
            }
            catch(err) { expect(err.message).toBe(`User validation failed: email: ${users[0].email} is already taken.`) }
          });

          it('should be a valid email', async () => {
            const email = "fake@";
            try {
              await new User({ ...users[0], email }).save();
            }
            catch(err) { expect(err.message).toBe(`User validation failed: email: ${email} is not a valid email`) }
          });
        });

        describe('password', () => {
          it('should throw error if length < 8', async () => {
            const password = "1234567";
            try {
              await new User({ ...users[0], password }).save();
            }
            catch(err) {
              const message = `User validation failed: password: Path \`password\` (\`${password}\`) is shorter than the minimum allowed length (8).`;
              expect(err.message).toBe(message);
            }
          });

          it('should save if length = 8', async () => {
            const count = await User.count();
            const password = "12345678";
            const user = await new User({ ...users[0], password }).save();
            expect(user).toBeInstanceOf(User);
            expect(await User.count()).toBe(count+1);
          });
        });

        describe('tokens', () => {
          it('creates a new token on save', async () => {
            const user = await new User(users[0]).save();
            expect(user.tokens.length).toBe(1);
            const token = _.first(user.tokens);

            expect(token._id).toBeTruthy();
            expect(token.token).toBeTruthy();
            expect(token.access).toBe(ACCESS_TYPES.auth);
          });
        });
      });

      describe('pre-save', () => {
        describe('new user', () => {
          it('saves password as hash password', async () => {
            let password = users[0].password;
            let user = await new User(users[0]).save();
            expect(user.password).not.toBe(password);
          });
        })

        describe('existing user', () => {
          beforeEach(populateUsers);

          describe('password was modified', () => {
            it('saves the new password hash', async () => {
              let user = await User.findOne();
              const hashPassword = user.password;
              user.password = 'piyopiyo';
              await user.save();

              expect(user.password).not.toBe(hashPassword);
            });
          });

          describe('password was not modified', () => {
            it('keeps the same password hash', async () => {
              let user = await User.findOne();
              const hashPassword = user.password;
              user.first_name = 'tester';
              await user.save();

              expect(user.password).toBe(hashPassword);
            });
          });
        });

      });

      describe('methods', () => {
        beforeEach(populateUsers);

        describe('#findByToken', () => {
          describe('Success', () => {
            it('returns the User', async () => {
              const token = _.first(users[0].tokens).token;
              const user = await User.findByToken(token);

              expect(user.first_name).toEqual(users[0].first_name);
              expect(user.last_name).toEqual(users[0].last_name);
              expect(user.email).toEqual(users[0].email);
            });
          });

          describe('Error', () => {
            it('returns a rejected promise', async () => {
              try {
                const user = await User.findByToken('garbabe');
                expect('should not come here').toEqual('here');
              }
              catch(err) { expect(err).toBe(FAILED_TOKEN_MSG) }
            });
          });
        });

        describe('#findByCredentials', () => {
          describe('Success', () => {
            it('returns the User', async () => {
              const user = await User.findByCredentials(users[0].email, users[0].password);

              expect(user.first_name).toEqual(users[0].first_name);
              expect(user.last_name).toEqual(users[0].last_name);
              expect(user.email).toEqual(users[0].email);
            });

          });

          describe('Error', () => {
            it('returns undefined and errors out', async () => {
              try {
                const user = await User.findByCredentials('wrong@email.com', 'hogehoge');
                expect('should not come here').toEqual('here');
              }
              catch(err) { expect(err).toBe('Email does not exist') }
            });
          });
        });

        describe('#generateAuthToken', () => {
          it('adds a new token to the user', async () => {
            const user = await User.findOne();
            const count = user.tokens.length;
            await user.generateAuthToken();
            expect(user.tokens.length).toBe(count+1);
            expect(_.last(user.tokens).access).toBe(ACCESS_TYPES.auth);
          });
          it('sets the access if provided', async () => {
            const user = await User.findOne();
            await user.generateAuthToken('facebook');
            expect(_.last(user.tokens).access).toBe('facebook');
          });
        });

        describe('#removeToken', () => {
          describe('token exists', () => {
            it('removes the token', async () => {
              let user = await User.findOne();
              const token = _.last(user.tokens).token;
              await user.removeToken(token);
              user = await User.findOne();
              const tokens = user.tokens.map((item) => item.token);

              expect(tokens).not.toContain(token);
            });

            describe('token does not exist', () => {
              it('does not remove any tokens', async () => {
                let user = await User.findOne();
                const token = _.last(user.tokens).token;
                await user.removeToken('barbage');
                user = await User.findOne();
                const tokens = user.tokens.map((item) => item.token);

                expect(tokens).toContain(token);
              });
            });
          })

        });

        describe('#authFromProvider', () => {
          const name = 'Bob Hope';
          const id = 1234;
          const email = "bob@tester.com";
          const params = {
            accessToken: "abc123",
            first_name: 'Bob',
            last_name: 'Hope',
            userID: id,
            email,
            name
          };

          describe('Success', () => {
            describe('New Customer', () => {
              it('should return a user (not save)', async () => {
                User.isAuthorizedByProvider = jest.fn(() => true);
                const user = await User.authFromProvider(params);
                expect(await User.findOne({ email })).toBeNull();
                expect(user.toJSON()).toHaveProperty('_id');
                expect(user.toJSON()).toHaveProperty('email', email);
              });

            });

            describe('Existing Customer', () => {
              it('should return a saved user', async () => {
                User.isAuthorizedByProvider = jest.fn(() => true);
                const user = await User.authFromProvider({...users[0]});
                expect(await User.findOne({email: users[0].email})).not.toBeNull();
                expect(user.toJSON()).toHaveProperty('_id');
                expect(user.toJSON()).toHaveProperty('email', users[0].email);
              });
            });
          });

          describe('Error', () => {
            it('should return a rejected promise', async () => {
              User.isAuthorizedByProvider = jest.fn(() => false);
              try {
                const user = await User.authFromProvider(params);
                expect('should not be here').toBe('here');
              }
              catch(e) { expect(e).toBe(AUTH_FAIL_MSG) }
            });
          });
        });

        describe('#isAuthorizedByProvider', () => {
          const name = 'Bob Hope';
          const userID = '123abc';

          describe('Data matches', () => {
            it('returns true for valid access', async () => {
              axios.get = jest.fn((url) => {
                return {data: { name, id: userID }}
              });
              const authorized = await User.isAuthorizedByProvider({name, userID});
              expect(authorized).toBeTruthy;
            });
          })

          describe('Data does not match', () => {
            it('returns false for invalid access', async () => {
              axios.get = jest.fn((url) => {
                return { data: { name: 'noone', id: 'fake' }}
              });
              const authorized = await User.isAuthorizedByProvider({name, userID});
              expect(authorized).toBeFalsey;
            });
          });
        });

        describe('#toJSON', () => {
          it('returns _id and email', async () => {
            let user = await User.findOne();
            expect(user.toJSON()).toHaveProperty("_id", user._id);
            expect(user.toJSON()).toHaveProperty("email", user.email);
          });
        });
      });

    });
  });
});
