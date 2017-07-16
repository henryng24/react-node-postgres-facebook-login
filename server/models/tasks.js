const db = require('../config/dbConfig.js');
const Sequelize = require('sequelize');
const User = require('./users.js');

const Task = db.define('Task',
  {
    user_ID: Sequelize.INTEGER,
    description: Sequelize.STRING,
    time: Sequelize.INTEGER
  }
);

db.sync();

module.exports = Task;