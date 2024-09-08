const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('user_db', 'my_user', 'mypassword', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
