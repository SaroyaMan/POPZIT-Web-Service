const subgenres     = require('../data/subgenres.json'),
      keys          = require('../keys'),
      request       = require('request'),
      jsdom         = require("jsdom"),
      { JSDOM }     = jsdom,
      youtubeSearch = require('youtube-search');


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

        //if(lastFmAlbomJson.album === null) {
        //    res.status(400).json({"error": `Album ${album} by artist ${artist} has not been found`});
        //    return; //In order to avoid sending a response twice to the client.
        //}

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

    getSongParsed(artist, track)
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
                            console.log('failed to find!');
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