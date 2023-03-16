//const require = require("require")
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//const routeFilm = require("./route/routeFilm")
const express = require('express');
//import {routeUser} from './route/routeUser.js'
//const routeUser = require("./route/routeUser.js")

const app = express()

//Or app.js shall take userroute point at user.js and film.js under route folder.
//const userroute = require("./route/user")
//const filmroute = require("./route/film")
// custom middleware logger
//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ DB Configuration ------------//
const db = require('./config/MongoDBkey').MongoURI;

//------------ Mongo Connection ------------//
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log(err));

    //------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.set('view engine', 'ejs');

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }))

//------------ Express session Configuration ------------//
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


// built-in middleware for json Database
//app.use(json())
//app.use(urlencoded({extend: true}))

//------------ Routes ------------//
//app.use('/', routeUser)
app.use('/', require('./route/index'));
app.use('/auth', require('./route/routeUser'));
//app.use('/auth', require('./route/routeUser.auth'));
//app.use('/apply', require('./route/apply'));
//app.use('/login', require('./route/login'));
//app.use('/update', require('./route/update'));

//app.use('/apply', routeUser.apply);
//app.use('/login', routeUser.login);
//app.use('/update', routeUser.update);

const PORT = process.env.PORT || 3008;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));