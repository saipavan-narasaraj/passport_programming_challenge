const factorySchema = require('../models/factorySchema');
/*
    This file contains logic to delete factory and emit details to all clients.
*/
module.exports = async (req, res, next) => {
    try {
        let factoryDeleted = await factorySchema.findOneAndRemove({ name: req.params.name });
        if (!factoryDeleted) {
            return res.status(404).send(new Error('Not Found Error', [req.params.name + ' not found']));
        } else {
            req.io.sockets.emit('deleteFactory', req.params.name);
            res.status(200).json({
                success: true
            })
        }
    } catch (err) {
        return res.status(500).send(new Error('Unknown server error', ['Unknown server error when trying to delete ' + req.params.name]));
    }
};