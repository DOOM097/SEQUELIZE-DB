const { Sequelize } = require('sequelize');

const connection = new Sequelize('book', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;
