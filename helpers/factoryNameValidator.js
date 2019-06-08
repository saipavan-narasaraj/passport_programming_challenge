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
            "maxLength": 50
        }
    }
};

let factoryNameValidator = (data) => {
    let validator = v.validate(data, addressSchema);
    return validator
}

module.exports = factoryNameValidator
