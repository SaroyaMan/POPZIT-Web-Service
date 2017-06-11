const express = require('express'),
      router = express.Router(),
      bcrypt = require('bcryptjs'),
      jwt = require('jsonwebtoken');
User = require('../models/user');

//Sign up route
router.post('/', (req,res,next) => {
    let user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        date: req.body.date,
        gravatarHash: req.body.gravatarHash
    });
    user.save( (err, result) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        res.status(201).json({
            message: 'User Created',
            obj: result
        });
    });
});

router.post('/signin', (req,res,next) => {
    User.findOne({email: req.body.email}, (err, doc) => {
        if(err) {                                        //some error...
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if(!doc) {                                       //No mail was found
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if(!bcrypt.compareSync(req.body.password, doc.password)) {   //Wrong password
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        let token = jwt.sign({user:doc}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            user: doc,
            userId: doc._id
        });
    });
});

module.exports = router;