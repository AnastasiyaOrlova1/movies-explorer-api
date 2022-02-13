
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
// База данных
const mongoose = require('mongoose');
// ПОРТ
const { NODE_ENV, PORT = 3000, DATA_BASE } = process.env;
// РОУТЫ
const routes = require('./routes/index');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const app = express();

// helmet
app.use(helmet());

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB
mongoose.connect(
  NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb'
);

// логгер запросов
app.use(requestLogger);

app.use(
  cors({
    origin: [
      'https://movie.orlova.nomoredomains.rocks',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: 'GET, PUT, PATCH, POST, DELETE',
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  })
);

// rate limiter
app.use(limiter);

// Подключение роутов
app.use(routes);

// Обработка ошибок
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
