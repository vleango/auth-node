const _ = require('lodash');

let { User } = require('../models/user');

let userParams = (body) => {
  return _.pick(body, ['email', 'first_name', 'last_name', 'password', "access", "accessToken", "userID"]);
};

exports.register = async (req, res) => {
  try {
    let user = new User(userParams(req.body));
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }
  catch (e) { res.status(400).send(e) }
};

exports.login = async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  }
  catch (e) { res.status(400).send(e) }
};

exports.provider = async (req, res) => {
  try {
    const body = userParams(req.body);
    const user = await User.authFromProvider(body);
    await user.save();
    const token = await user.generateAuthToken(body.access);
    res.header('x-auth', token).send(user);
  }
  catch (e) { res.status(400).send(e) }
};

exports.logout = async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  }
  catch (e) { res.status(400).send(e) }
};
