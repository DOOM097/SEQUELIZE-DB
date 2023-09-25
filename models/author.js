const { DataTypes } = require('sequelize');
const connection = require('../config/database'); 
const Book = require('./book');

const Author = connection.define('Author', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'author_id'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
}, {
    timestamps: false
});

Author.belongsToMany(Book, { through: 'BookAuthor' });
module.exports = Author;
