const factorySchema = require('../models/factorySchema');
/*
    This file contains logic to send the list factories.
*/
module.exports = async (req, res, next) => {
    try {

        let factories = await factorySchema.find();
        res.status(200).json({
            data: factories
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

