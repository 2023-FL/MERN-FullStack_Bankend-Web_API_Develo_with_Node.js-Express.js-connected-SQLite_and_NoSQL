'use strict'
const request = require('request')

const bodyParser = require('body-parser')
const { json } = require('body-parser')
const sqlite3 = require('sqlite3').verbose()


const datetime = require('date-and-time')
const { findTimeZone, getZonedTime } = require('timezone-support')
//const dateUtc = zonedTimeToUtc(datetime, 'Asia/Hong_Kong')


//const nativeDate = new Date()
//const HKtime = getZonedTime(nativeDate, hongkong)
var moment = require('moment-timezone');
const { Int32 } = require('mongodb')
const HKtime = moment().tz("Asia/Hong_Kong").format();

let db = new sqlite3.Database('../module/users.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
    db.run(`
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
                console.log( "Error creating table: ", err );
            } else {
                console.log( "Username and Password were inserted in test2.db SQLite3 succesfully." );
            }
            //db.close();
    });
  });