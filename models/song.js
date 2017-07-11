const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const song = new Schema({
    name: {type: String, required: true},
    artist: {type: String, required: true},
    youtubeId: {type: String, required: true},
    album: {type: Object, required: true},

});

module.exports = song;