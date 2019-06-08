const Validator = require('jsonschema').Validator;
const v = new Validator();

/* 
    Middleware to validate PUT AND POST request body.
*/
const addressSchema = {
    "type": "object",
    "properties": {
        "name": { "type": "string" },
        "minRange": { "type": "number" },
        "maxRange": { "type": "number" },
        "childrenCount": { "type": "number" }
    }
};
module.exports = (req, res, next) => {
    try {
        let validator = v.validate(req.body, addressSchema);
        if (validator.errors.length === 0) {
            next();
        } else {
            return res.status(500).send(new Error('validation error', ['payload validation error']));
        }
    } catch (err) {
        return res.status(500).send(new Error('Unknown server error', ['Unknown server error when trying to delete ' + req.params.name]));
    }
}
