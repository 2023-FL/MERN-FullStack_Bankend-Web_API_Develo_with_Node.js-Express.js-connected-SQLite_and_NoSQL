'use strict'
const request = require('request')

const bodyParser = require('body-parser')
const { json } = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
//const sqlite3 = require("sqlite3");


const Filmdb = new sqlite3.Database( './module/films.db', (err)=>{
    if ( err ){ console.log("Error connecting to films database."); }
    Filmdb.run(`
        CREATE TABLE IF NOT EXISTS films(
            id integer NOT NULL PRIMARY KEY,
            title text NOT NULL,
            year text NOT NULL,
            imdbID text NOT NULL,
            poster text NOT NULL,
            rating integer NOT NULL
        )
    `, (err)=>{
        if ( err ){
            console.log( "Error creating film table: ", err );
        } else {
            console.log( "Film Database succesfully created." );
        }
        Filmdb.close();
    });
});

const Userdb = new sqlite3.Database( './module/users.db', (err)=>{
    if ( err ){ console.log("Error connecting to films database."); }
    Userdb.run(`
    CREATE TABLE IF NOT EXISTS users(
        id integer PRIMARY KEY AUTOINCREMENT,
        username text,
        password text,           
        firstName text,
        lastName text,
        resetPasswordToken text,
        resetPasswordExpires text,
        createDate TimeStamp
        )
    `, (err)=>{
        if ( err ){
            console.log( "Error creating users table: ", err );
        } else {
            console.log( "Users table succesfully created." );
        }
        Userdb.close();
    });
});