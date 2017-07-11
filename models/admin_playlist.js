const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      song = require('./song');

const miniUser = new Schema({
    id: {type: String, required: true},
    email: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    birthdate: {type: Date, required: true},
    gravatarHash: {type:String, required: true}
});

const schema = new Schema({
    user: {type:miniUser, required: true},
    songs:[song],
}, {collection: 'admin_playlists'});

module.exports = mongoose.model('AdminPlaylist',schema);