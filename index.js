const fs = require('fs');
const sequelize = require('./config/database'); 
const Book = require('./models/book');
const Author = require('./models/author');
const Category = require('./models/category');

const jsonDataPath = './books.json';

fs.readFile(jsonDataPath, 'utf8', async (err, data) => {
    if (err) {
        console.error('Ошибка при чтении JSON-файла:', err);
        return;
    }

    const jsonData = JSON.parse(data);

    try {

        await sequelize.sync();


        const booksData = jsonData.map((item) => {
            const { authors, categories, ...bookData } = item;
            return bookData;
        });
        const authorsData = [...new Set(jsonData.flatMap((item) => item.authors))];
        const categoriesData = [...new Set(jsonData.flatMap((item) => item.categories))];

        await Book.bulkCreate(booksData);
        await Author.bulkCreate(authorsData.map((name) => ({ name })));
        await Category.bulkCreate(categoriesData.map((name) => ({ name })));

        console.log('Данные успешно добавлены в базу данных');
    } catch (error) {
        console.error('Ошибка при добавлении данных в базу данных:', error);
    } finally {

        await sequelize.close();
    }
});
