const subgenres     = require('../data/subgenres.json'),
      keys          = require('../keys'),
      request       = require('request'),
      jsdom         = require("jsdom"),
      //{ JSDOM }     = jsdom,
      youtubeSearch = require('youtube-search'),
      Playlist      = require('../models/playlist'),
      AdminPlaylist = require('../models/admin_playlist');


exports.getDefaultSubgenres = (req, res, next) => {

    res.status(200).json(subgenres);
};

exports.getAlbum = (req, res, next) => {

    let album  = req.query.name,
        artist = req.query.artist;

    if(artist === undefined || album === undefined) {
        res.status(400).json({"error": 'artist or name not sent'});
        return; //In order to avoid sending a response twice to the client.
    }

    request.get(`${keys.LASTFM_KEY}&method=album.getinfo&artist=${artist}&album=${album}`, (err, resp, body) => {

        let lastFmAlbomJson = JSON.parse(body);
        res.status(200).json(lastFmAlbomJson);
    });
};


exports.getSong = (req, res, next) => {
    let artist = req.query.artist,
        track  = req.query.track;

    if(artist === undefined || track === undefined) {
        res.status(400).json({"error": 'artist or track not sent'});
        return; //In order to avoid sending a response twice to the client.
    }

    new Promise( (resolve, reject) => {
        request.get(`${keys.LASTFM_KEY}&method=track.getInfo&artist=${artist}&track=${track}`,
            (err, resp, body) => {
                if(err) {
                    reject({"error": err});
                    return; //In order to avoid sending a response twice to the client.
                }

                let lastFmJsonSong = JSON.parse(body);

                if(lastFmJsonSong.track === undefined) {       //Song not found
                    reject({"error": `Song ${track} by artist ${artist} has not been found`});
                    return; //In order to avoid sending a response twice to the client.
                }

                let albumName = lastFmJsonSong.track.album !== undefined ?
                    lastFmJsonSong.track.album.title : 'unknown';

                let imgPath = lastFmJsonSong.track.album !== undefined ?
                    lastFmJsonSong.track.album.image[2]['#text'] : 'unknown';

                let songJson =
                        {
                            "artist": artist,
                            "track": track,
                            "album": albumName,
                            "imagePath": imgPath
                        };
                resolve(songJson);
            });
    })
        .then( (jsonResponse)       => res.status(200).json(jsonResponse))
        .catch( (jsonErrorResponse) => res.status(400).json(jsonErrorResponse));
};

exports.getYoutubeSong = (req, res, next) => {
    let artist = req.query.artist,
        track  = req.query.track;

    if(artist === undefined || track === undefined) {
        res.status(400).json({"error": 'artist or track not sent'});
        return; //In order to avoid sending a response twice to the client.
    }

    let opts = {
        maxResults: 1,
        key: keys.YOUTUBE_KEY
    };

    youtubeSearch(`${artist} - ${track} - lyrics`, opts, function(err, results) {
        if(err) {
            res.status(500).json({"error": err});
            return; //In order to avoid sending a response twice to the client.
        }
        //res.status(200).json(results);
        let youtubeId = results[0].id;
        let songJson =
                {
                    "artist": artist,
                    "track": track,
                    //"album": albumName,
                    "youtubeId": youtubeId,
                    "youtube": `https://www.youtube.com/watch?v=${youtubeId}`
                };
        res.status(200).json(songJson);
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

/*
 function getSongParsed(artist, track) {

 return new Promise( (resolve, reject) => {
 request.get(`${keys.LASTFM_KEY}&method=track.getInfo&artist=${artist}&track=${track}`,
 (err, resp, body) => {
 if(err) {
 reject({"error": err});
 return; //In order to avoid sending a response twice to the client.
 }

 let lastFmJsonSong = JSON.parse(body);

 if(lastFmJsonSong.track === undefined) {       //Song not found
 reject({"error": `Song ${track} by artist ${artist} has not been found`});
 return; //In order to avoid sending a response twice to the client.
 }

 request.get(lastFmJsonSong.track.url, (err, resp, body) => {
 if(err) {
 reject({"error": err});
 return; //In order to avoid sending a response twice to the client.
 }
 const dom = new JSDOM(body);
 let anchorTag = dom.window.document.querySelector(`a[data-youtube-id]`);
 if(anchorTag === null) {       //Song not found
 reject({"error": `Song ${track} by artist ${artist} has not been found`});
 return; //In order to avoid sending a response twice to the client.
 }

 let youtubeId = anchorTag.getAttribute("data-youtube-id");
 //let albumName = lastFmJsonSong.track.album !== undefined ?
 //                lastFmJsonSong.track.album.title : 'unknown';
 let songJson =
 {
 "artist": artist,
 "track": track,
 //"album": albumName,
 "youtubeId": youtubeId,
 "youtube": `https://www.youtube.com/watch?v=${youtubeId}`
 };
 resolve(songJson);
 }
 );
 });
 });
 }
 */