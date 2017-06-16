const express = require('express'),
      router = express.Router(),
      musicController = require('../controllers/musicController');

//get static subgenres
router.get('/', musicController.getDefaultSubgenres);

//get album
router.get('/album', musicController.getAlbum);

//get song
router.get('/song', musicController.getSong);

//get songs from album
//router.post('/album_songs', musicController.getSongsFromAlbum);

module.exports = router;