const fs = require('fs');

const sequelize = require('./config/database');

// Подключаем модели
const Book = require('./models/book');
const Author = require('./models/author');
const Category = require('./models/category');

// Путь к JSON
const jsonDataPath = './books.json';

// Определение связи многие-ко-многим между моделями
Book.belongsToMany(Author, { through: 'BookAuthor', timestamps: false });
Book.belongsToMany(Category, { through: 'BookCategory', timestamps: false });
Author.belongsToMany(Book, { through: 'BookAuthor', timestamps: false });
Category.belongsToMany(Book, { through: 'BookCategory', timestamps: false });

//sync() для создания таблиц и связей в базе данных
  sequelize.sync()
  .then(async () => {
      //Вместо ожидания завершения операции, асинхронная функция обратного вызова позволяет продолжить выполнение остальной части кода.
      //data - это параметр функции обратного вызова, который будет содержать содержимое файла после успешного чтения
    fs.readFile(jsonDataPath, 'utf8', async (err, data) => {
      if (err) {
        console.error('Ошибка при чтении JSON:', err);
        return;
      }
      const jsonData = JSON.parse(data);
      try {
            // Создание массива данных для модели Book
            //...bookData - это оператор "распыления" (spread operator), который собирает все остальные свойства объекта item и сохраняет их в переменной bookData в виде объекта. 
            const booksData = jsonData.map((item) => {
            const { authors, categories, ...bookData } = item;
            return bookData;
        });

          // Создание массивов данных для моделей Author и Category
          //.flatMap() для извлечения значений authors и categories из объектов JSON
          const authorsData = [...new Set(jsonData.flatMap((item) => item.authors))];
          const categoriesData = [...new Set(jsonData.flatMap((item) => item.categories))];
        
          
          //await для массовой вставки (или создания) записей в базе данных
          //bulkCreate метод который позволяет вставлять множество записей в базу данных сразу.
          //await перед Book.bulkCreate, вы ждете завершения операции вставки данных в базу данных, прежде чем перейти к следующим действиям
          await Book.bulkCreate(booksData);
          //если authorsData содержит ['Автор1', 'Автор2'], то после .map() получится массив объектов [{ name: 'Автор1' }, { name: 'Автор2' }]
          await Author.bulkCreate(authorsData.map((name) => ({ name })));
          await Category.bulkCreate(categoriesData.map((name) => ({ name })));

          // Проходим по каждому элементу данных в JSON и устанавливаем связи для каждой книги.
          for (const item of jsonData) {

          // Находим книгу, авторов, категории в таблицах
          const book = await Book.findOne({ where: { title: item.title } });
          const bookAuthors = await Author.findAll({ where: { name: item.authors } });
          const bookCategories = await Category.findAll({ where: { name: item.categories } });

          //bookAuthors представляет массив авторов, которые мы связываем с данной книгой.
          await book.setAuthors(bookAuthors);
          await book.setCategories(bookCategories);
        }

        console.log('Данные добавлены!');
      } catch (error) {
        console.error('Ошибка при добавлении данных:', error);
      } finally {

        await sequelize.close();
      }
    });
  })
  .catch((error) => {
    console.error('Ошибка при синхронизации:', error);
  });
