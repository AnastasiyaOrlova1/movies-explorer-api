const express = require('express');

const mongoose = require('mongoose');

const app = express();

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;
// const helmet = require('helmet');
// const cors = require('cors');
// const limiter = require('./middlewares/limiter');
 const dotenv = require('dotenv');
const { errors } = require('celebrate');
//const userRouter = require('./routes/users');
//const { createUser, login } = require('./controllers/users');
//const movieRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
//const { validateSignUp, validateSignIn } = require('./middlewares/validation');
//const NotFoundError = require('./errors/NotFoundError');

dotenv.config();
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

/* app.use(
  limiter,
  helmet(),
  cors({
  origin: 'https://diploma.orlovas.nomoredomains.rocks',
  credentials: true,
}));

app.use(helmet()); */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

/*app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use('/users', auth, userRouter);
app.use('/movies', auth, movieRouter);

app.all('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});*/
app.use('/', router);

app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
