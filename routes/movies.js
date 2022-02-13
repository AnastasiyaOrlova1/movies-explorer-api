const router = require('express').Router();
const { validateCreateMovie, validateRemoveMovie } = require('../middlewares/validation');
const { createMovie, deleteMovie, getMovies } = require('../controllers/movies');

/*router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateRemoveMovie, deleteMovie);*/

router.get('/movies', getMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('/movies/:movieId', validateRemoveMovie, deleteMovie);

module.exports = router;
