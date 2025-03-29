const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllbooks = async (_req, res) => {
    //#swagger.tags=['books']
    try {
        const books = await mongodb.getDatabase().db().collection('books').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ books });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSinglebooks = async (req, res) => {
    //#swagger.tags=['books']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid user id to find a contact.');
    }

    const bookId = new ObjectId(req.params.id);
    try {
        const books = await mongodb.getDatabase().db().collection('books').findOne({ _id: bookId });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ books });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createUserbooks = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const books = {
            bookTitle: req.body.bookTitle,
            authorName: req.body.authorName,
            borrowerName: req.body.borrowerName,
            dateBorrowed: req.body.dateBorrowed,
            dateReturn: req.body.dateReturn,
            phoneNumber: req.body.phoneNumber,
            librarian: req.body.librarian,
        };
        const response = await mongodb.getDatabase().db().collection('books').insertOne(books);
    if (response.acknowledged > 0) {
        res.status(204).send();
    } else {
        res.status(500),json(response.error || 'Some error accured while updating the user.');
    }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserbooks = async (req, res) => {
    //#swagger.tags=['books']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid contact id to update a contact.');
    }

    const bookId = new ObjectId(req.params.id);
    const books = {
        bookTitle: req.body.bookTitle,
        authorName: req.body.authorName,
        borrowerName: req.body.borrowerName,
        dateBorrowed: req.body.dateBorrowed,
        dateReturn: req.body.dateReturn,
        phoneNumber: req.body.phoneNumber,
        librarian: req.body.librarian,
    };

    try {
        const response = await mongodb.getDatabase().db().collection('books').replaceOne({ _id: bookId }, books);
    console.log(response);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500),json(response.error || 'Some error accured while updating the user.');
    }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUserbooks = async (req, res) => {
    //#swagger.tags=['books']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid contact id to delete a contact.');
    }

    const bookId = new ObjectId(req.params.id);
    try {
        const response = await mongodb.getDatabase().db().collection('books').deleteOne({ _id: bookId });
    console.log(response);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500),json(response.error || 'Some error accured while updating the user.');
    }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllbooks,
    getSinglebooks,
    createUserbooks,
    updateUserbooks,
    deleteUserbooks
};