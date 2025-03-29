const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (_req, res) => {
    //#swagger.tags=['personalinfo']
    try {
        const personalinfo = await mongodb.getDatabase().db().collection('personalinfo').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ personalinfo });
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
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ personalinfo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=['personalinfo']
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber
        };
        const response = await mongodb.getDatabase().db().collection('personalinfo').insertOne(user);
    if (response.acknowledged > 0) {
        res.status(204).send();
    } else {
        res.status(500),json(response.error || 'Some error accured while updating the user.');
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

    try {
        const response = await mongodb.getDatabase().db().collection('personalinfo').replaceOne({ _id: userId }, user);
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

const deleteUser = async (req, res) => {
    //#swagger.tags=['personalinfo']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('Must use a valid contact id to delete a contact.');
    }

    const userId = new ObjectId(req.params.id);
    try {
        const response = await mongodb.getDatabase().db().collection('personalinfo').deleteOne({ _id: userId });
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
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};