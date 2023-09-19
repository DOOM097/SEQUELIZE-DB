const connection = require('./config/database');
const Author = require('./models/author')
const Book = require('./models/book')
connection.sync({force:true})