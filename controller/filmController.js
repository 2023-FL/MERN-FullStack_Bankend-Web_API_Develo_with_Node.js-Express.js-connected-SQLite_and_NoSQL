//Import Express library
const express = require("express")

//Import Cloud Database of MongoDB
const mongoClient = require("mongodb").MongoClient

//Config Registered Username and Password of Cloud Database of MongoDB
const mongo_username = 'Lab5'  // update your username
const mongo_password = 'Abc123' // update your password

//Config Connection URL of Cloud Database of MongoDB
const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.aqj7cgz.mongodb.net/?retryWrites=true&w=majority`  //copy the path from your personal info registered on the online mongodb account
//Config Databse Name and Collection Name of MongoDB
const DATABASE_NAME = "project" // Update your database name here
const FILMCOLLECTION = "movie" // Update your collection name here

//Config 
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const bodyParser = require("body-parser");
app.use( bodyParser.json() );

//Creaate local MySQL connection
const sqlite3 = require("sqlite3");
// Congfig local MySQL Database
const DB_PATH = "films.db";



const filmController = {
//Create local Database in json file
  filmDB = {
  films: require('../model/films.json'),
  setUsers: function (filmDB) { this.films = filmDB }
},
//------------------------------------------------------------------
//Get all films records in json format through OMDb api
  getOMDb = (req, res) => {
    const title = "*"
    let apikey = "bff6445f";
    const url = `http://www.omdbapi.com/?i=tt3896198&apikey=${apikey}&s=${title}`
	  console.log("url is: ", url),
    request(url, (err, res, body) => {
		if (err) reject(new Error('invalid API call'))
    //const json = JSON.parse(body)
    //const output = JSON.stringify(json.Title[code])
		const json = JSON.parse(body).Search
    console.log("json1 is: ", json)
    res.json(filmDB.films);
    })
  },
//--Get one movie record by inputing movie title-------------
  getFilm = (req, res) => {
    const title = req.params.film
    //const title = req.body
    //const title = (readline.question('Input movie name :'))
    let apikey = "bff6445f";
    const url = `http://www.omdbapi.com/?i=tt3896198&apikey=${apikey}&s=${title}`
	  console.log("url is: ", url),
    request(url, (err, res, body) => {
		if (err) reject(new Error('invalid API call'))
    //const json = JSON.parse(body)
    //const output = JSON.stringify(json.Title[code])
		const json = JSON.parse(body).Search
    console.log("json1 is: ", json)
    res.json(filmDB.films);
    })
  },


/**
   * Add new record of film using local databse of films.json
  **/
  createNewFilm = (req, res) => {
    const newFilm = {
        id: filmDB.films?.length ? filmDB.films[filmDB.films.length - 1].id + 1 : 1,
        movietitle: req.body.title,
        movieyear: req.body.year,
        imdbID: req.body.imdbID,
        poster: req.body.poster
    }

    if (!newFilm.movietitle) {
        return res.status(400).json({ 'message': 'Movie title is required.' });
    }

    filmDB.setFilm([...filmDB.films, newFilm]);
    res.status(201).json(filmDB.films);
  },
//Create new film and save into mongoDB database
  app.post('/film', (req, res)=>{
  console.log('Create a new film')
  //insert items of each record in DB.
  mongoClient.connect(CONNECTION_URI)
    .then((db)=> { db.db(DATABASE_NAME).collection(USERCOLLECTION).insertMany({$set:req.body},                               
  {
  "title": req.body.title,
  "year": req.body.year,
  "imdbID": req.body.imdbID,
  "poster": req.body.poster,
  "rating": req.body.rating
  },(err) => {
        if(err) {
          res.status(500).send({"status":500, "description":err})
        } else {
          res.status(201).send({"status":201, "description": "Movie inserted successfully"})
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({'status': 500, "description": err}) 
    })
}),
//Create a new film record and save into MySQL
  app.post( "/createFilm", (req, res)=>{
  const filmdb = new sqlite3.Database( DB_PATH, (err)=>{
      if ( err ){ return console.log(err); }
      filmdb.run(`
      INSERT INTO movies (title, year, imdbID, poster, rating) VALUES (?, ?, ?, ?, ?)
      `,[req.body.title, req.body.year, req.body.imdbID, req.body.poster, req.body.rating], (err)=>{
          if (err) { 
              filmdb.close(); 
              return console.log(err); 
          }
          res.status(200).json({
              msg: "Entry film information succesfully inserted to the DB",
              body: req.body
          });
      })

    });
  }),
//-----------------------------------------------------------------------------------
  /**
   * Update the registered record of film to local database of films.json
  **/
  updateFilm = (req, res) => {
    const film = filmDB.films.find(emp => emp.id === parseInt(req.body.id));
    if (!film) {
        return res.status(400).json({ "message": `Film record ${req.body.id} not found` });
    }
    if (req.body.title) filmDB.film = req.body.title;
    if (req.body.imdbID) filmDB.imdbID = req.body.imdbID;
    const filteredArray = filmDB.films.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, film];
    filmDB.setFilm(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(filmDB.films);
  },
  
//Update movie record in MongoDB
  app.put('/updateFilm/:movietitle', (req, res)=>{
  const movietitle = req.params.movietitle
  const filter = {"title": movietitle}
  const update = {"Rating": req.body}
  //const options = { returnNewDocument: true }
  const options = { "_id": 1, "password": 1 }
  
  mongoClient.connect(CONNECTION_URI)
  .then((db)=>{
    db.db(DATABASE_NAME).collection(USERCOLLECTION).findOneAndUpdate(filter,update,options,(err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
            console.log(`Can't updated user password of ${movietitle}`)
          } else {
            res.status(201).send({"status":201, "description": "Updated movie rating of " + movietitle + " successfully"})
            console.log(`Updated user password of ${movietitle} successfully`)
          }
        })
    })
  .catch((err) => {
      console.log(err)
      res.status(500).send({'status': 500, "description": err}) 
    })
  }),

//Update movie record in MySQL
  app.post( "/filmUpdate", (req, res)=>{
  const filmdb = new sqlite3.Database( DB_PATH, (err)=>{
      if ( err ){ return console.log(err); }
      db.run(`
      INSERT INTO movies (title, year, imdbID, poster, ratingg) VALUES (?, ?, ?, ?, ?)
      `,[req.body.title, req.body.year, req.body.imdbID, req.body.poster, req.body.rating], (err)=>{
          if (err) { 
              filmdb.close(); 
              return console.log(err); 
          }
          res.status(200).json({
              msg: "Entry succesfully inserted to the DB",
              body: req.body
          });
      })

    });
  }),

//-------------------------------------------------------------------------
  /**
   * Delete the existing record of user
  **/
  removeFilm = (req, res) => {
    const user = data.user.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `User ID ${req.body.id} not found` });
    }
    const filteredArray = data.user.filter(emp => emp.id !== parseInt(req.body.id));
    data.setUser([...filteredArray]);
    res.json(data.user);
  },
//---------------------------------------------------------------------------  
/**
   * Login a registered user
**/
  filmrecord = (req, res) => {
    const film = filmDB.films.find(emp => emp.id === parseInt(req.params.id));
    if (!film) {
        return res.status(400).json({ "message": `Film record ${req.params.id} not found` });
    }
    res.json(film);
  },
}
module.exports = filmController

//{
    //list,
    //createNewFilm,
    //updateFilm,
    //removeFilm,
    //filmrecord
//}
