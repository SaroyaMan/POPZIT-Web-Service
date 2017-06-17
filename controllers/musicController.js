const subgenres = require('../data/subgenres.json'),
      keys = require('../keys'),
      request = require('request'),
      jsdom = require("jsdom"),
      { JSDOM } = jsdom,
      youtubeSearch = require('youtube-search');


exports.getDefaultSubgenres = (req, res, next) => {

    res.status(200).json(subgenres);
};

exports.getAlbum = (req, res, next) => {

    let album  = req.query.album,
        artist = req.query.artist;

    if(artist === undefined || track === undefined) {
        res.status(400).json({"error": 'artist or track not sent'});
        return; //In order to avoid sending a response twice to the client.
    }

    request.get(`${keys.LASTFM_KEY}&method=album.getinfo&artist=${artist}&album=${album}`, (err, resp, body) => {
        res.status(200).json(JSON.parse(body));
    });
};


exports.getSong = (req, res, next) => {
    let artist = req.query.artist,
        track  = req.query.track;

    if(artist === undefined || track === undefined) {
        res.status(400).json({"error": 'artist or track not sent'});
        return; //In order to avoid sending a response twice to the client.
    }

    getSongParsed(artist, track).then( (jsonResponse) => res.status(200).json(jsonResponse));

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

    youtubeSearch(`${artist} - ${track}`, opts, function(err, results) {
        if(err) {
            res.status(500).json({"error": err});
            return; //In order to avoid sending a response twice to the client.
        }
        res.status(200).json(results);
    });

};


function getSongParsed(artist, track) {

    return new Promise( (resolve, reject) => {
        request.get(`${keys.LASTFM_KEY}&method=track.getInfo&artist=${artist}&track=${track}`,
            (err, resp, body) => {
                if(err) {
                    res.status(500).json({"error": err});
                    return; //In order to avoid sending a response twice to the client.
                }

                let lastFmJsonSong = JSON.parse(body);
                request.get(lastFmJsonSong.track.url, (err, resp, body) => {
                        if(err) {
                            res.status(500).json({"error": err});
                            return; //In order to avoid sending a response twice to the client.
                        }
                        const dom = new JSDOM(body);
                        let youtubeId = dom.window.document.querySelector(`a[data-youtube-id]`).getAttribute("data-youtube-id");
                        songJson =
                            {
                                "artist": artist,
                                "track": track,
                                "album": lastFmJsonSong.track.album.title,
                                "youtubeId": youtubeId,
                                "youtube": `https://www.youtube.com/watch?v=${youtubeId}`
                            };
                        resolve(songJson);
                    }
                );
            });
    });
}