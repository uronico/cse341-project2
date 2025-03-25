const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (_req, res) => {
    //#swagger.tags=['personalinfo']
    try {
        const personalinfo = await mongodb.getDatabase().db().collection('personalinfo').find().toArray();
        const books = await mongodb.getDatabase().db().collection('books').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ personalinfo, books });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['personalinfo']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid user id to find a contact.');
    }

    const userId = new ObjectId(req.params.id);
    try {
        const personalinfo = await mongodb.getDatabase().db().collection('personalinfo').findOne({ _id: userId });
        const books = await mongodb.getDatabase().db().collection('books').find({ userId: userId }).toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ personalinfo, books });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=['personalinfo']
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber
    };

    const books = {
        bookTitle: req.body.bookTitle,
        authorName: req.body.authorName,
        borrowerName: req.body.borrowerName,
        dateBorrowed: req.body.dateBorrowed,
        dateReturn: req.body.dateReturn,
        phoneNumber: req.body.phoneNumber,
        librarian: req.body.librarian,
        userId: null // This will be set after inserting the user
    };

    try {
        const userResponse = await mongodb.getDatabase().db().collection('personalinfo').insertOne(user);
        if (userResponse.acknowledged) {
            books.userId = userResponse.insertedId;
            const booksResponse = await mongodb.getDatabase().db().collection('books').insertOne(books);
            if (booksResponse.acknowledged) {
                res.status(201).send();
            } else {
                res.status(500).json(booksResponse.error || 'Some error occurred while creating the books.');
            }
        } else {
            res.status(500).json(userResponse.error || 'Some error occurred while creating the user.');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['personalinfo']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid contact id to update a contact.');
    }

    const userId = new ObjectId(req.params.id);
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber
    };

    const books = {
        bookTitle: req.body.bookTitle,
        authorName: req.body.authorName,
        borrowerName: req.body.borrowerName,
        dateBorrowed: req.body.dateBorrowed,
        dateReturn: req.body.dateReturn,
        phoneNumber: req.body.phoneNumber,
        librarian: req.body.librarian
    };

    try {
        const userResponse = await mongodb.getDatabase().db().collection('personalinfo').replaceOne({ _id: userId }, user);
        const booksResponse = await mongodb.getDatabase().db().collection('books').replaceOne({ userId: userId }, books);
        if (userResponse.modifiedCount > 0 && booksResponse.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(userResponse.error || booksResponse.error || 'Some error occurred while updating the user.');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['personalinfo']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid contact id to delete a contact.');
    }

    const userId = new ObjectId(req.params.id);
    try {
        const userResponse = await mongodb.getDatabase().db().collection('personalinfo').deleteOne({ _id: userId });
        const booksResponse = await mongodb.getDatabase().db().collection('books').deleteMany({ userId: userId });
        if (userResponse.deletedCount > 0 && booksResponse.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(userResponse.error || booksResponse.error || 'Some error occurred while deleting the user.');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};