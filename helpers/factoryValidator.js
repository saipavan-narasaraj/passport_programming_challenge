const Validator = require('jsonschema').Validator;
const v = new Validator();

/* 
    Middleware to validate PUT AND POST request body.
*/
const addressSchema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength": 3,
            "maxLength": 50,
            "pattern": "^[a-zA-Z0-9\\s]*$"
        },
        "minRange": {
            "type": "number",
            "minimum": 1,
            "maximum": 100000
        },
        "maxRange": {
            "type": "number",
            "minimum": 1,
            "maximum": 100000
        },
        "childrenCount": {
            "type": "number",
            "minimum": 1,
            "maximum": 15
        }
    },
    "required": ["name", "minRange", "maxRange", "childrenCount"]
};

let factoryValidator = (data) => {
    let validator = v.validate(data, addressSchema);
    return validator
}

module.exports = factoryValidator
