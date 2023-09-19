const { DataTypes } = require('sequelize');
const connection = require('../config/database'); 

const Author = connection.define('Author', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true,
        field: 'author_id'
      },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Author;
