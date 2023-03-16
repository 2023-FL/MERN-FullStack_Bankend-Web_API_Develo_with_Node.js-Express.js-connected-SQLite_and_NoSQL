//Create local Database in json format
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
//Creaate MySQL connection
const sqlite3 = require("sqlite3");
// CONFIGURE THE DATABASE
const DB_PATH = "database.db";

const bodyParser = require("body-parser");
app.use( bodyParser.json() );

//Initialize encryption function for username and password
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTs
        res.json({ 'success': `User ${user} is logged in!` });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };