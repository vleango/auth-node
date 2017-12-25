const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    first_name: 'Bob',
    last_name: 'Hope',
    email: 'test1@test.com',
    password: 'hogehoge',
    tokens: [
    {
      access: 'auth',
      token: jwt.sign({
        _id: userOneId,
        access: 'auth'
      }, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    first_name: 'John',
    last_name: 'Smith',
    email: 'test2@test.com',
    password: 'piyopiyo',
    tokens: [
    {
      access: 'auth',
      token: jwt.sign({
        _id: userTwoId,
        access: 'auth',
      }, process.env.JWT_SECRET).toString()
    }]
  }
];

const populateUsers = (done) => {
  User.remove({}).then(() => {

    // couldn't use `.insertMany` because it will not
    // run our middleware.... so call `.save()` individially
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    // use `Promise.all` to wait for all promises to complete
    return Promise.all([
      userOne,
      userTwo
    ]);

  }).then(() => done());
};

module.exports = {
  users,
  populateUsers
};
