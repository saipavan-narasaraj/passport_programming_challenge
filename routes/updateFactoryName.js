const factorySchema = require('../models/factorySchema');
const factoryNameValidator = require('../helpers/factoryNameValidator');

/*
    This file contains logic to update factory name and emit details to all clients.
*/
module.exports = async (req, res, next) => {
    try {
        let factory = req.body
        let validateFactoryName = factoryNameValidator(factory)
        if (validateFactoryName.errors.length === 0) {
            let updateFactory = await factorySchema.findOneAndUpdate({ name: req.params.name }, { $set: { name: factory.name } }, { new: true });
            if (!updateFactory) {
                return res.status(404).send(new Error('Not Found Error', ['Bookmark for user id ' + req.params.userId + ' and bookmark id ' + req.params.bookmarkId + ' not found']));
            } else {
                let payload = {
                    success: true,
                    data: {
                        oldName: req.params.name,
                        newName: factory.name
                    }
                }
                req.io.sockets.emit('updateFactoryName', payload);
                res.status(200).send(payload);
            }
        } else {
            res.status(422).send(validateFactoryName.errors)
        }
    } catch (err) {
        res.status(500).send(new Error('Unknown Server Error', ['Unknow server error when updating bookmark for user id ' + req.params.userId + ' and bookmark id ' + req.params.bookmarkId]));
    }
};

