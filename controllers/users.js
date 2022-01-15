const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');
const { JWT_SECRET } = require('../utils/constants');

dotenv.config();

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователя с таким id не существует');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Id не верный'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    throw new AuthError('Пароль или почта некорректны');
  }
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new DuplicateError('Пользователь с таким email уже существует'));
        } else if (err.name === 'ValidationError' || err.name === 'CastError') {
          next(new ValidationError('Пароль или почта некорректны'));
        } else {
          next(err);
        }
      });
  });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new ValidationError('Введенные данные некорректны');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователя с таким id не существует');
    })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Введенные данные некорректны'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getMyUser,
  updateUser,
};
