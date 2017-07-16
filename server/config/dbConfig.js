const Sequelize = require('sequelize');
const fs = require('fs');

console.log(process.env.DATABASE_URL)

if (process.env.DATABASE_URL) {
  const match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  const sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: console.log,
    dialectOptions: {
      ssl: true
    }
  });
  module.exports = sequelize;
} else {
  // const username = String(fs.readFileSync(__dirname + '/databaseusername'));
  // const password = String(fs.readFileSync(__dirname + '/databasepassword'));
  // const databaseName = String(fs.readFileSync(__dirname + '/databasename'));
  // const host = String(fs.readFileSync(__dirname + '/host'));
  const sequelize = new Sequelize('template1', '', '', {
    dialect: 'postgres',
    protocol: 'postgres',
    port: '5432',
    host: 'localhost',
    logging: console.log,
    dialectOptions: {
      ssl: false
    }
  });
  module.exports = sequelize;
}