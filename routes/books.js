const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const validation = require('../validator/bookValidator');
const {isAuthenticated} = require('../validator/authenticate');

router.get('/', booksController.getAllbooks);

router.get('/:id', booksController.getSinglebooks);

router.post('/', isAuthenticated, validation.saveBooks, booksController.createUserbooks);

router.put('/:id', isAuthenticated, validation.saveBooks, booksController.updateUserbooks);

router.delete('/:id', isAuthenticated, booksController.deleteUserbooks);

module.exports = router;

