const factorySchema = require('../models/factorySchema');
const generateRandomNumbers = require("../helpers/generateRandomNumbers")

/*
    This file contains logic to update factory and emit details to all clients.
*/
module.exports = async (req, res, next) => {
    try {
        let factory = req.body
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
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            res.status(409).send(new Error('Duplicate key', [err.message]));
        }
        res.status(500).send(new Error('Unknown Server Error', ['Unknow server error when updating bookmark for user id ' + req.params.userId + ' and bookmark id ' + req.params.bookmarkId]));
    }
};

