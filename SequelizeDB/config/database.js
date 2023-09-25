const { Sequelize } = require('sequelize');

const connection = new Sequelize('book', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false, 
  },
});

module.exports = connection;
