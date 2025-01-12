require('./logs/logger');
const express = require('express');
const connect = require('./dbConnect');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes/route');
app.use('/', routes);

connect().then(() => {
  logInfo('Database connected successfully');
}).catch((err) => {
  logError('Error connecting to database:', err);
});

app.get('/', function (req, res) {
  try {
    res.send('welcome');
  } catch (error) {
    logError('Error rendering the home view:', error);
  }
});

module.exports = { app, connect };
