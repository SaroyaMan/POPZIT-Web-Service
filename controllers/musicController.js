const subgenres = require('../data/subgenres.json'),
      keys = require('../keys'),
      request = require('request'),
      jsdom = require("jsdom"),
      { JSDOM } = jsdom;


//let requestSync = require('sync-request');


//function getSingleAlbum(artist, name) {
//
//    return new Promise( (resolve, reject) => {
//        request.get(`${keys.LASTFM_KEY}&method=album.getinfo&artist=${artist}&album=${name}`,
//            (err, resp, body) => resolve(JSON.parse(body) )
//        );
//    });
//}


exports.getDefaultSubgenres = (req, res, next) => {

    res.status(201).json(subgenres);


    //for(let subgenre of subgenres) {
    //    subgenre['parsedAlbums'] = [];
    //    for(let album of subgenre.albums) {
    //        request.get(`${keys.LASTFM_KEY}&method=album.getinfo&artist=${album.artist}&album=${album.name}`,
    //            (err, resp, body) => {
    //                subgenre.parsedAlbums.push(JSON.parse(body) );
    //                res.status(201).json(subgenres);
    //            }, () => {if(i === subgenres.length-1) res.status(201).json(subgenres);}
    //
    //        );
    //    }
    //}
};


exports.getAlbum = (req, res, next) => {

    let album  = req.query.album,
        artist = req.query.artist;
    request.get(`${keys.LASTFM_KEY}&method=album.getinfo&artist=${artist}&album=${album}`, (err, resp, body) => {
        res.status(201).json(JSON.parse(body));
    });
};


exports.getSong = (req, res, next) => {
    let artist = req.query.artist,
        track  = req.query.track;
    //request.get(`${keys.LASTFM_KEY}&method=track.getInfo&artist=${artist}&track=${track}`, (err, resp, body) => {
    //    let lastFmJsonSong = JSON.parse(body);
    //
    //    request.get(lastFmJsonSong.track.url, (err, resp, body) => {
    //        const dom = new JSDOM(body);
    //        let youtubeId = dom.window.document.querySelector(`a[data-youtube-id]`).getAttribute("data-youtube-id");
    //        res.status(201).json(
    //            {
    //                "artist": artist,
    //                "track": track,
    //                "album": lastFmJsonSong.track.album.title,
    //                "youtubeId": youtubeId,
    //                "youtube": `https://www.youtube.com/watch?v=${youtubeId}`
    //            }
    //        );
    //    });
    //});
    getSongParsed(artist, track).then( (jsonResponse) => res.status(201).json(jsonResponse));

};


//exports.getSongsFromAlbum = (req, res, next) => {
//
//    let artist = req.body.artist;
//    let songs  = req.body.songs;
//    let songNames = [];
//    for(let track of songs) {
//        songNames.push(track.name);
//    }
//    //console.log(songNames);
//
//
//    let jsonSongs = [];
//    for(let i in songNames) {
//        getSongParsed(artist, songNames[i]).then( (jsonResponse) => {
//            jsonSongs.push(jsonResponse);
//            if(i == +(songNames.length - 1) ) {
//                res.status(200).json(jsonSongs);
//            }
//        } );
//    }
//};


function getSongParsed(artist, track) {

    return new Promise( (resolve, reject) => {
        request.get(`${keys.LASTFM_KEY}&method=track.getInfo&artist=${artist}&track=${track}`,
            (err, resp, body) => {
                let lastFmJsonSong = JSON.parse(body);
                request.get(lastFmJsonSong.track.url, (err, resp, body) => {
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