const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseUniqueValidator = require('mongoose-unique-validator');

const schema = new Schema({
    email: {type:String, required: true, unique:true},
    password:{type:String, required: true},
    firstName:{type:String, required: true},
    lastName:{type:String, required: true},
    date: {type:Date, required: true },
    gravatarHash: {type:String, required: true}
}, {collection: 'users'});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User',schema);