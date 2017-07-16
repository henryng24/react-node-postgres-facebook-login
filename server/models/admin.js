const db = require('../config/dbConfig.js');
const Sequelize = require('sequelize');
const User = require('./users.js');

const Admin = db.define('Admin',
  {
    admin_ID: Sequelize.INTEGER,
    user_ID: Sequelize.INTEGER
  }
);

db.sync();

module.exports = Admin;