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

//save playlist of specific user
router.post('/savePlaylist', musicController.savePlaylist);

//get playlist of specific user
router.get('/playlist', musicController.getPlaylist);

//get all public (admin) playlists
router.get('/allAdminPlaylists', musicController.getAllAdminPlaylists);

//get all playlists of specific admin user
router.get('/adminPlaylists', musicController.getAdminPlaylists);

//save playlist of admin user so it will be public for all users
router.post('/publishPlaylist', musicController.publishPlaylist);

//update playlist of admin user by playlist ID
router.post('/updateAdminPlaylist', musicController.updateAdminPlaylist);

//remove playlist of admin user by playlist ID
router.post('/removeAdminPlaylist', musicController.removeAdminPlaylist);

module.exports = router;