// Модуль для работы с файловой системой Node.js
const fs = require('fs');

// Подключаем настройки базы данных Sequelize из файла database.js
const sequelize = require('./config/database');

// Подключаем модели данных (таблицы)
const Book = require('./models/book');
const Author = require('./models/author');
const Category = require('./models/category');

// Путь к JSON-файлу с данными для заполнения базы данных
const jsonDataPath = './books.json';

// Определение связи многие-ко-многим между моделями
Book.belongsToMany(Author, { through: 'BookAuthor', timestamps: false });

Book.belongsToMany(Category, { through: 'BookCategory', timestamps: false });
Author.belongsToMany(Book, { through: 'BookAuthor', timestamps: false });
Category.belongsToMany(Book, { through: 'BookCategory', timestamps: false });

// Вызов sync() для создания таблиц и связей в базе данных

// Синхронизация моделей с базой данных. Это создаст таблицы, если их нет.
sequelize.sync()
  .then(async () => {
    // Чтение данных из JSON-файла

    // Чтение содержимого JSON-файла с данными. Если произойдет ошибка, будет выведено сообщение об ошибке.
    fs.readFile(jsonDataPath, 'utf8', async (err, data) => {
      if (err) {
        console.error('Ошибка при чтении JSON-файла:', err);
        return;
      }

      // Разбор JSON-данных в объект
      const jsonData = JSON.parse(data);

      try {

        // Создание массива данных для модели Book, исключая поля authors и categories из каждого элемента данных.
        const booksData = jsonData.map((item) => {
          const { authors, categories, ...bookData } = item;
          return bookData;
        });

        // Создание массивов данных для моделей Author и Category, уникальных значений имен авторов и категорий.
        const authorsData = [...new Set(jsonData.flatMap((item) => item.authors))];
        const categoriesData = [...new Set(jsonData.flatMap((item) => item.categories))];


        // Создание записей в таблице Book на основе массива booksData.
        await Book.bulkCreate(booksData);

        // Создание записей в таблице Author на основе массива authorsData, с преобразованием имен в объекты.
        await Author.bulkCreate(authorsData.map((name) => ({ name })));

        // Создание записей в таблице Category на основе массива categoriesData, с преобразованием имен в объекты.
        await Category.bulkCreate(categoriesData.map((name) => ({ name })));

        // Установка связей между книгами, авторами и категориями

        // Проходим по каждому элементу данных в JSON и устанавливаем связи для каждой книги.
        for (const item of jsonData) {
          // Находим книгу в таблице Book по названию.
          const book = await Book.findOne({ where: { title: item.title } });

          // Находим авторов в таблице Author по именам из данных.
          const bookAuthors = await Author.findAll({ where: { name: item.authors } });

          // Находим категории в таблице Category по именам из данных.
          const bookCategories = await Category.findAll({ where: { name: item.categories } });

          // Устанавливаем связи между книгой, авторами и категориями.
          await book.setAuthors(bookAuthors);
          await book.setCategories(bookCategories);
        }

        console.log('Данные успешно добавлены в базу данных');
      } catch (error) {
        console.error('Ошибка при добавлении данных в базу данных:', error);
      } finally {

        await sequelize.close();
      }
    });
  })
  .catch((error) => {
    console.error('Ошибка при синхронизации базы данных и создании связей:', error);
  });
