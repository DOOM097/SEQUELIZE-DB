const { DataTypes } = require('sequelize');
const connection = require('../config/database'); 
const Book = require('./book');

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
Category.belongsToMany(Book, { through: 'BookCategory' });
module.exports = Category;

