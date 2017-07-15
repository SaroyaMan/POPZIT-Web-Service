const Playlist      = require('../models/playlist'),
      AdminPlaylist = require('../models/admin_playlist');

exports.getPlaylist = (req, res, next) => {
    let userId = req.query.userId;
    Playlist.findOne({user: userId})
        .then( (playlist) => {
            res.status(200).json(playlist);
        })
        .catch( (err) => {
            res.status(400).json({"error": `playlist of user ${userId} not found`});
        });
};

exports.savePlaylist = (req, res, next) => {
    let data = req.body;

    Playlist.update({user: data.user}, {user: data.user, songs: data.songs}, {upsert: true },
        (err) => {
            if(err) {
                console.log(`err: ${err}`);
                res.status(500).json(err);
            }
            else {
                console.log('Playlist updated');
                res.status(201).json({user: data.user, songs: data.songs});
            }
        });
};

exports.getAdminPlaylists = (req, res, next) => {
    let userId = req.query.userId;
    AdminPlaylist.find({'user.id': userId})
        .then( (playlists) => {
            if(playlists.length === 0) throw err;
            res.status(200).json(playlists);
        })
        .catch( (err) => {
            res.status(400).json({"error": `admin playlists of user ${userId} not found`});
        });
};

exports.getAllAdminPlaylists = (req, res, next) => {
    AdminPlaylist.find()
        .then( (playlists) => {
            if(playlists.length === 0) throw err;
            res.status(200).json(playlists);
        })
        .catch( (err) => {
            res.status(400).json({"error": `admin playlists of user ${userId} not found`});
        });
};

exports.publishPlaylist = (req, res, next) => {
    let data = req.body;

    let adminPlaylist = new AdminPlaylist({
        user: data.user,
        songs: data.songs
    });
    adminPlaylist.save(
        (err) => {
            if(err) {
                console.log(`err: ${err}`);
                res.status(500).json(err);
            }
            else {
                console.log('Admin Playlist saved');
                res.status(201).json({user: data.user, songs: data.songs});
            }
        });
};

exports.updateAdminPlaylist = (req, res, next) => {
    let playlistId = req.body.id;
    let songs      = req.body.songs;
    AdminPlaylist.update({_id: playlistId},{songs: songs}, {upsert: true},
        (err) => {
            if(err) {
                console.log(`err: ${err}`);
                res.status(500).json(err);
            }
            else {
                console.log('Admin Playlist updated');
                res.status(201).json({user: data.user, songs: data.songs});
            }
        })
};

exports.removeAdminPlaylist = (req, res, next) => {
    let playlistId = req.body.id;
    AdminPlaylist.remove({_id: playlistId}, (err) => {
        if(err) {
            res.status(400).json({"error": `admin playlist ${playlistId} has not found`});
        }
        res.status(200).json("Msg: Successfully removed");
    });
};