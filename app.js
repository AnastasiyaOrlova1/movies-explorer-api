
/*const express = require('express');

const mongoose = require('mongoose');

const app = express();

//const { PORT = 3000 } = process.env;
const { NODE_ENV, PORT = 3001, MONGO_URL } = process.env
//const { NODE_ENV, PORT = 3001, DATA_BASE } = process.env;
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
//const { MONGO_URL } = require('./utils/constants');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
dotenv.config();
app.use(helmet());


dotenv.config();
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/moviesdb');*/

/*mongoose.connect(
  NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb'
);*/

/*app.use(cors({
  origin: 'https://movie.orlova.nomoredomains.rocks',
  credentials: true,
}));*/


/*app.use(
  cors({
    origin:
  [
    'https://api.movie.orlova.nomoredomains.rocks',
    'http://localhost:3000',
  ],
    credentials: true,
    methods: 'GET, PUT, PATCH, POST, DELETE',
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  }),
);

app.use(limiter);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(router);

app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});*/


require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
// База данных
const mongoose = require('mongoose');
// ПОРТ
const { NODE_ENV, PORT = 3001, DATA_BASE } = process.env;
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
      'https://api.movie.orlova.nomoredomains.rocks',
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
