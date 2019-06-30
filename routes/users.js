const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//user model
const User = require('../models/User');

//login page
router.get('/login', (req, res) => res.render('login'));

//register page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required fields
    if (!email || !name || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields.' });
    }

    // check passwords match
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match.' });
    }

    //check password length
    if (password.length < 8 || password.length > 16) {
        errors.push({ msg: 'Passwords should be 8-16 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    //hash password
                    bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        //save user
                        newUser.save()
                        .then( user => {
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                    }))
                }
            });
    }
});

module.exports = router;