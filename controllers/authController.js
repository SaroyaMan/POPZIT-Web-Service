const bcrypt = require('bcryptjs'),
      jwt    = require('jsonwebtoken'),
      md5    = require('md5'),
      User   = require('../models/user');


exports.signup = (req, res, next) => {

    let email = req.body.email;

    let user = new User({
        email: email,
        password: bcrypt.hashSync(req.body.password, 10), //encrypt the password
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthdate: req.body.birthdate,
        gravatarHash: md5(email)    //encrypt the email in order to get gravatar Hash code
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
};


exports.signin = (req, res, next) => {

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
};