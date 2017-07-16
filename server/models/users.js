const db = require('../config/dbConfig.js');
const Sequelize = require('sequelize');

const User = db.define('User',
  {
    email: Sequelize.STRING
  }
);

db.sync();

module.exports = User;