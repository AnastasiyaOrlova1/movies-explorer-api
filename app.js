
const express = require('express');

const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { MONGO_URL } = require('./utils/constants');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
dotenv.config();
app.use(helmet());


//dotenv.config();
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

/*app.use(cors({
  origin: 'https://movie.orlova.nomoredomains.rocks',
  credentials: true,
}));*/


app.use(
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
});
