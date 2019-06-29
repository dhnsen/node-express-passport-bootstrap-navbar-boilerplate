const express = require('express');
const router = express.Router();

//login page
router.get('/login', (req, res) => res.send('Sending from login'));

//register page
router.get('/register', (req, res) => res.send('Sending from register'));

module.exports = router;