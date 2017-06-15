const express = require('express'),
      router = express.Router(),
      subgenres = require('../data/subgenres.json'),
      keys = require('../keys'),
      request = require('request');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//get categories
router.get('/', (req,res,next) => {

    res.status(201).json(subgenres);
});


//get album
router.get('/album', (req,res,next) => {

    let album = req.query.album,
        artist = req.query.artist;
    request.get(`${keys.LASTFM_KEY}&method=album.getinfo&artist=${artist}&album=${album}`, (err, resp, body) => {
        console.log(body);
        res.status(201).json(JSON.parse(body));
    });
});


//get song
router.get('/song', (req, res,next) => {

    let artist = req.query.artist,
        track  = req.query.track;
    request.get(`${keys.LASTFM_KEY}&method=track.getInfo&artist=${artist}&track=${track}`, (err, resp, body) => {
        let lastFmJsonSong = JSON.parse(body);

        request.get(lastFmJsonSong.track.url, (err, resp, body) => {
            const dom = new JSDOM(body);
            let youtubeId = dom.window.document.querySelector(`a[data-youtube-id]`).getAttribute("data-youtube-id");
            console.log(`youtube: https://www.youtube.com/watch?v=${youtubeId}`);
            res.status(201).json(
                {
                    "artist": artist,
                    "track": track,
                    "album": lastFmJsonSong.track.album.title,
                    "youtubeId": youtubeId,
                    "youtube": `https://www.youtube.com/watch?v=${youtubeId}`
                }
            );
        });
    });

});

module.exports = router;