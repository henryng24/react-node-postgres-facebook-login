const db = require('../config/dbConfig.js');

const Admin = require('./admin.js');
const Task = require('./tasks.js');
const User = require('./users.js');

User.hasMany(Task, {foreignKey: 'user_ID'})
Task.belongsTo(User, {foreignKey: 'user_ID'})

Admin.belongsTo(User, {foreignKey: 'admin_ID'})
Admin.belongsTo(User, {foreignKey: 'user_ID'})
User.hasMany(Admin, {foreignKey: 'user_ID'})

db.sync();