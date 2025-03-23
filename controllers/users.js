const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    mongodb
    .getDatabase()
    .db()
    .collection('users')
    .find()
    .toArray((err, lists) => {
        if (err){
            res.status(400).json({ message: err});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Users']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid user id to find a contact.');
      }

    const userId = new ObjectId(req.params.id);
    mongodb
    .getDatabase()
    .db()
    .collection('users')
    .find({ _id: userId })
    .toArray((err, result) => {
        if (err){
            res.status(400).json({ message: err});
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    });

};

const createUser = async (req, res) => {
    //#swagger.tags=['Users']
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }
    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
    if (response.acknowledged > 0) {
        res.status(204).send();
    } else {
        res.status(500),json(response.error || 'Some error accured while updating the user.');
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to update a contact.');
      }

    const userId = new ObjectId(req.params.id);
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    }
    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);
    console.log(response);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500),json(response.error || 'Some error accured while updating the user.');
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to delete a contact.');
      }

    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });
    console.log(response);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500),json(response.error || 'Some error accured while updating the user.');
    }
}

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};