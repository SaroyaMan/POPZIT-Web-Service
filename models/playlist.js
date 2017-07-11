const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      mongooseUniqueValidator = require('mongoose-unique-validator'),
      User = require('./user'),
      song = require('./song');

const schema = new Schema({
    user:{type:Schema.Types.ObjectId, ref:'User',required: true, unique: true},
    songs:[song],
}, {collection: 'playlists'});


schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Playlist',schema);