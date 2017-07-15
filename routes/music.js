const express = require('express'),
      router = express.Router(),
      musicController = require('../controllers/musicController');

//get static subgenres
router.get('/defaultSubgenres', musicController.getDefaultSubgenres);

//get album
router.get('/album', musicController.getAlbum);

//get song
router.get('/song', musicController.getSong);

//get song youtube details
router.get('/youtubeSong', musicController.getYoutubeSong);

module.exports = router;