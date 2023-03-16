'use strict'
const request = require('request')

const bodyParser = require('body-parser')
const { json } = require('body-parser')
const SQLite3 = require('sqlite3').verbose()


const datetime = require('date-and-time')
const { findTimeZone, getZonedTime } = require('timezone-support')
//const dateUtc = zonedTimeToUtc(datetime, 'Asia/Hong_Kong')


//const nativeDate = new Date()
//const HKtime = getZonedTime(nativeDate, hongkong)
var moment = require('moment-timezone');
const { Int32 } = require('mongodb')
const HKtime = moment().tz("Asia/Hong_Kong").format();

//-------Write new user record into users.json text file------------
const usersDB = {
    users: require('../module/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    // check for duplicate usernames in the db
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) return res.sendStatus(409); //Conflict 
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //store the new user
        const newUser = { "username": user, "password": hashedPwd };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'module', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }

    //-----Write a new user record into SQLite3 Database--------------
    const db = new SQLite3.Database( 'test2.db', (err)=>{
        if ( err ){ console.log("Error connecting to database."); }
        db.run(`
                CREATE TABLE IF NOT EXISTS lemon(
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

        var entry = `'${user}', '${pwd}', '${HKtime}'` //strftime('%Y-%m-%d %H:%M:%S:%s')
        var sql = "INSERT INTO lemon(Title, Year, imdbID, Poster, Rating, createDate) VALUES (" + entry + ")"

        var r = await db.run(sql)
        //r = await sqlite.run(sql) //use const sqlite = require("aa-sqlite")
        if(r) console.log("New username "+ user + " was(were) inserted to SQLite3 DB.")

        var rows = await db.all("SELECT id, Title FROM lemon WHERE id = ?", [1])  // params must be iterable
        Object.keys(rows).forEach(key => {
            console.log("row_id is: ", rows[key].id);
            console.log("row_Title is: ", rows[key].user);
        });

        await db.close()


}


module.exports = { handleNewUser };