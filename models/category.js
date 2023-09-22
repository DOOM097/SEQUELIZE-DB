const { DataTypes } = require('sequelize');
const connection = require('../config/database'); 

const Category = connection.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true,
        field: 'category_id'
      },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
    timestamps: false,
    
});

module.exports = Category;

