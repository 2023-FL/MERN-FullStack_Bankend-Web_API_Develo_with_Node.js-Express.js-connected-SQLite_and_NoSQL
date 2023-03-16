const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth');
//const { default: App } = require('../src/App');
//let App = require('./src/App.js');

//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});

//------------ Movies Route ------------//
router.get('/movies', ensureAuthenticated, (req, res) => res.render('dash', {
    name: req.user.name
    //utils: App   
}));

module.exports = router;