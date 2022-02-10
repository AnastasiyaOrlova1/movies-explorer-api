const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: (props) => `${props.value} Cсылка невалидна`,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: (props) => `${props.value} Cсылка невалидна`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validator.isURL(url),
      message: (props) => `${props.value} Cсылка невалидна`,
    },
  },
  nameRU: {
    type: String,
    required: true,
    validator: (nameRU) => /[\dа-я\sё]+$/gi.test(nameRU),
  },
  nameEN: {
    type: String,
    required: true,
    validator: (nameRU) => /\w+$/i.test(nameRU),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('movie', movieSchema);
