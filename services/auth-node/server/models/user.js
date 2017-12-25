const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
var uniqueValidator = require("mongoose-unique-validator");
const axios = require("axios");

const AUTH_FAIL_MSG = "Authorization Failed";
const FAILED_TOKEN_MSG = "Invalid token";
const UNIQUE_FAILED_MSG = "{VALUE} is already taken.";
const ACCESS_TYPES = {
  auth: "auth",
  facebook: "facebook"
};

const schema = require("./schemas/user-schema");
const UserSchema = new mongoose.Schema(schema);
UserSchema.plugin(uniqueValidator, { message: UNIQUE_FAILED_MSG });

UserSchema.pre("save", function (next) {
  const user = this;

  if(user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }
  else { next(); }
});

// class methods
UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try { decoded = jwt.verify(token, process.env.JWT_SECRET) }
  catch (e) { return Promise.reject(FAILED_TOKEN_MSG) }

  return User.findOne({
    "_id": decoded._id,
    "tokens.token": token
  });

};

UserSchema.statics.findByCredentials = async function (email, password) {
  const User = this;
  const user = await User.findOne({ email });
  if(!user) {
    return Promise.reject("Email does not exist");
  }
  // need new Promise since bcrypt only supports callbacks
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      res ? resolve(user) : reject();
    });
  });
};

UserSchema.statics.authFromProvider = async function (data) {
  const User = this;

  if(this.isAuthorizedByProvider(data)) {
    let user = await User.findOne({email: data.email});
    if(!user) { user = new User({...data, password: data.userID}) }
    return Promise.resolve(user);
  }
  else { return Promise.reject(AUTH_FAIL_MSG) }
};

UserSchema.statics.isAuthorizedByProvider = async (data) => {
  const url = `${provider_verification_url({token: data.accessToken})[data.access]}`;
  const response = await axios.get(url);
  return response.data.name === data.name && response.data.id === data.userID;
};

// instance methods
UserSchema.methods.generateAuthToken = async function (access = ACCESS_TYPES.auth) {
  const user = this;

  const payload = { _id: user._id.toHexString(), access };
  const token = jwt.sign(payload, process.env.JWT_SECRET).toString();

  user.tokens.push({ access, token });
  await user.save();

  return token;
};

UserSchema.methods.removeToken = function (token) {
  const user = this;
  const result = user.update({ $pull: { tokens: { token }}});
  return result;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

// Helper methods

const provider_verification_url = ({token}) => {
  return {
    facebook: `https://graph.facebook.com/me?access_token=${token}`
  };
};

module.exports = {
  AUTH_FAIL_MSG,
  ACCESS_TYPES,
  FAILED_TOKEN_MSG,
  User: mongoose.model("User", UserSchema)
};
