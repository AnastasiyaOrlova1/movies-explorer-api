const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AuthError = require('../errors/AuthError');
const { JWT_SECRET } = require('../utils/constants');

dotenv.config();

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  try {
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new AuthError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');

    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
