const factorySchema = require('../models/factorySchema');
const generateRandomNumbers = require("../helpers/generateRandomNumbers")
const factoryValidator = require('../helpers/factoryValidator');

/*
    This file contains logic to update factory and emit details to all clients.
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
            let updateFactory = await factorySchema.findOneAndUpdate({ name: req.params.name }, factory, { new: true });
            if (!updateFactory) {
                return res.status(404).send(new Error('Not Found Error', ['Bookmark for user id ' + req.params.userId + ' and bookmark id ' + req.params.bookmarkId + ' not found']));
            } else {
                let payload = {
                    success: true,
                    data: factory
                }
                req.io.sockets.emit('updateFactory', payload);
                res.status(200).send(payload);
            }
        } else {
            res.status(422).send(validateFactory.errors)
        }

    } catch (err) {
        res.status(500).send(new Error('Unknown Server Error', ['Unknow server error when updating bookmark for user id ' + req.params.userId + ' and bookmark id ' + req.params.bookmarkId]));
    }
};

