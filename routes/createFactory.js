const factorySchema = require('../models/factorySchema');
const generateRandomNumbers = require("../helpers/generateRandomNumbers")
const factoryValidator = require('../helpers/factoryValidator');

/* 
    This file contains logic to insert new factory into database and emit details to all clients.
*/
module.exports = async (req, res, next) => {
    try {
        let factory = req.body
        let validateFactory = factoryValidator(factory)
        if (factory.minRange > factory.maxRange) {
            res.status(500).send(new Error('Range error', ["min value greater than max value"]));
        } else if (validateFactory.errors.length === 0) {
            factory.children = [];
            factory.children = generateRandomNumbers(factory.minRange, factory.maxRange, factory.childrenCount);
            let createFactory = new factorySchema(factory);
            let newFactory = await createFactory.save();
            req.io.sockets.emit('newFactory', newFactory);
            res.status(201).json({
                success: true
            })
        } else {
            res.status(422).send(validateFactory.errors)
        }
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            res.status(409).send(new Error('Duplicate key', [err.message]));
        }
        res.status(500).send(err);
    }
};


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
