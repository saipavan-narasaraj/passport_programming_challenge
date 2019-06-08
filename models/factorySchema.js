const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* 
    Mongoose Schema for factory.
*/
const factorySchema = new Schema({
    name: { type: String, unique: true, required: true, dropDups: true },
    minRange: Number,
    maxRange: Number,
    childrenCount: Number,
    children: Array
});

module.exports = mongoose.model('factorySchema', factorySchema);
