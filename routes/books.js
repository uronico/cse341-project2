const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const validation = require('../validator/bookValidator');

router.get('/', booksController.getAllbooks);

router.get('/:id', booksController.getSinglebooks);

router.post('/', validation.saveBooks, booksController.createUserbooks);

router.put('/:id', validation.saveBooks, booksController.updateUserbooks);

router.delete('/:id', booksController.deleteUserbooks);

module.exports = router;

