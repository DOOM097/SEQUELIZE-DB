const { DataTypes } = require('sequelize');
const connection = require('../config/database');
const Author = require('./author');

const Book = connection.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pageCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  publishedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
  },
  shortDescription: {
    type: DataTypes.TEXT,
  },
  longDescription: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


Book.belongsToMany(Author, { through: 'BookAuthors' });
module.exports = Book;
