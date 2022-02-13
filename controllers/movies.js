const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(200).send(movies))
    /*.catch(next);*/
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
  .orFail(new NotFoundError('Фильм не найден.'))
  .then((movie) => {
    if (!movie.owner.equals(req.user._id)) {
      return next(new ForbiddenError('Вы не можете удалить этот фильм.'));
    }
    return movie.remove().then(() => res.send({ message: 'Фильм удален.' }));
  })
  .catch(next);
};

  /*const userId = req.user._id;

   Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('NotFound');
    })
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError(
          'Действие недоступно. Вы не являетесь владельцем фильма',
        );
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then((removedMovie) => res.send(removedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверные данные'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Фильм не найден'));
      } else {
        next(err);
      }
    });
};*/

/*const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError(
          'Это не ваш фильм. Вы не можете удалять чужие',
        );
      }

      Movie.findByIdAndDelete(movieId)
        .then((removedMovie) => res.send(removedMovie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
};*/

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
