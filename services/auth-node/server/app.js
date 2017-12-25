require('./config/environments');
require('./db/mongoose');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require('cors');

const authRoutes = require('./routes/auth-routes');

const app = express();

const publicPath = path.join(__dirname, '..', 'public');

app.use(bodyParser.json());

app.use(cors({
  origin: process.env.ALLOWED_FRONTEND_URLS,
  exposedHeaders: ['x-auth'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use('/api/auth', authRoutes);

module.exports = app;
