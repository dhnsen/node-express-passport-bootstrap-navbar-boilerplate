const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

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
                            req.flash('success_msg', "You are now registered and can log in.");
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    }))
                }
            });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '../dashboard',
        failureRedirect: '../users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;