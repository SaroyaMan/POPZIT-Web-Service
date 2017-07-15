const express = require('express'),
      router = express.Router(),
      playlistController = require('../controllers/playlistController');

//get playlist of specific user
router.get('/getPlaylist', playlistController.getPlaylist);

//save playlist of specific user
router.post('/savePlaylist', playlistController.savePlaylist);

//get all public (admin) playlists
router.get('/allAdminPlaylists', playlistController.getAllAdminPlaylists);

//get all playlists of specific admin user
router.get('/adminPlaylists', playlistController.getAdminPlaylists);

//save playlist of admin user so it will be public for all users
router.post('/publishPlaylist', playlistController.publishPlaylist);

//update playlist of admin user by playlist ID
router.post('/updateAdminPlaylist', playlistController.updateAdminPlaylist);

//remove playlist of admin user by playlist ID
router.post('/removeAdminPlaylist', playlistController.removeAdminPlaylist);

module.exports = router;