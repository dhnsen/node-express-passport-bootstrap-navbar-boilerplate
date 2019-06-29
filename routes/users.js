const express = require('express');
const router = express.Router();

//login page
router.get('/login', (req, res) => res.render('login'));

//register page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required fields
    if(!email || !name || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields.'});
    }

    // check passwords match
    if(password != password2) {
        errors.push({ msg: 'Passwords do not match.'});
    }

    //check password length
    if(password.length < 8 || password.length > 16){
        errors.push({ msg: 'Passwords should be 8-16 characters'});
    }

    if (errors.length >0){
        
    } else {
        res.send('pass');
    }
});

module.exports = router;