'use strict'
const request = require('request');
const path = require("path");

const mongoClient = require("mongodb").MongoClient
const mongoose = require("mongoose")
//const bcrypt = require("bcryptjs")

const datetime = require('date-and-time')
const { findTimeZone, getZonedTime } = require('timezone-support')
//const dateUtc = zonedTimeToUtc(datetime, 'Asia/Hong_Kong')


//const nativeDate = new Date()
//const HKtime = getZonedTime(nativeDate, hongkong)
var moment = require('moment-timezone');
const { Int32 } = require('mongodb')
const HKtime = moment().tz("Asia/Hong_Kong").format();
const SQLite3 = require('sqlite3').verbose()
//const sqlite3 = require("sqlite3");
//const { open } = require("sqlite");
const bodyParser = require('body-parser')
const express = require("express")
const readline = require('readline-sync')
//const bcrypt = require("bcryptjs")


const mongo_username = 'lab5'  // update your username
const mongo_password = 'Abc123' // update your password


const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.aqj7cgz.mongodb.net/?retryWrites=true&w=majority`  //copy the path from your personal info registered on the online mongodb account
const DATABASE_NAME = "project" // Update your database name here
const USERCOLLECTION = "movie" // Update your collection name here

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/filmrecord/:movietitle', (req, res)=> {
    const movieTitle = req.params.movietitle
  
  let key = "bff6445f";
  const url = `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${movieTitle}`

  request.get(url, (err, res, body)=> {
      console.log("err: ", err)
      //if (err) reject(new Error('invalid API call'))
      console.log("body: ", body)
      //req.body.Title
      const json = JSON.parse(body).Search
      //const result = JSON.stringify(json) //make array to become json array
      const title = json.map(({ Title }) => Title )
      const year = json.map(({ Year }) => Year )
      const imdb = json.map(({ imdbID}) => imdbID )
      const poster = json.map(({ Poster }) => Poster )
      console.log("title & imdbID are: "+ title + " " + imdb)
      
      //const title = JSON.parse(body).Title
      //if (!json.hasOwnProperty(code)) reject(new Error(`invalid title ${code}`))
      console.log("Movie metadata can be found from api successfully")
        
        //Get what the movie I search ut with OMDB api and then to download the movie(s) into SQLite3 Database
        let InsertData = json.map(async (element) => {
            
        const Title = element.Title
        const Year = element.Year
        const imdb = element.imdbID
        const Poster = element.Poster

        const rate = readline.question(`Please enter rating for the movie ${Title} you like it is `);
        if (rate != null) {
            const RateMovie = rate.valueOf();
            console.log(`Your rating of this movie ${Title} is ${RateMovie}`);
        }

        const db = new SQLite3.Database( 'films.db', (err)=>{
            if ( err ){ console.log("Error connecting to database."); }
            console.log("Successfully connected to SQLite3")
            db.run(`
            CREATE TABLE IF NOT EXISTS movies(
              id integer PRIMARY KEY AUTOINCREMENT,
              Title text,
              Year text,
              imdbID text,
              Poster text,
              Rating Int32,
              createDate TimeStamp
                )
                `, (err)=>{
                    if ( err ){
                        console.log( "Error creating table: ", err );
                    } else {
                        console.log( `Movie of ${Title} inserted in table of SQLite3 succesfully.` );
                    }
                    //db.close();
                    });
            });
            var entry = `'${Title}', '${Year}','${imdb}','${Poster}', '${rate}', '${HKtime}'` //strftime('%Y-%m-%d %H:%M:%S:%s')
            var sql = "INSERT INTO movies(Title, Year, imdbID, Poster, Rating, createDate) VALUES (" + entry + ")"
            
            //r = await sql.run(`${Title}`)
            var r = await db.run(sql)
            //r = await sqlite.run(sql) //use const sqlite = require("aa-sqlite")
            if(r) console.log("Movie(s) " + Title + " was(were) inserted to SQLite3 DB.")
            //id++        
            //}
        

            var rows = await db.all("SELECT id, Title FROM movies WHERE id = ?", [1])  // params must be iterable
            Object.keys(rows).forEach(key => {
                console.log("row_id is: ", rows[key].id);
                console.log("row_Title is: ", rows[key].Title);
            });

            //await db.each("SELECT * FROM movies", [], function(row) {
            //console.log(row)
            //})
            //if(rows) console.log("row shown done.")
            await db.close()

        //Get what the movie I search ut with OMDB api and then to download the movie(s) into Mongo Database
        var id = 0
        for(var x in json) {
              const title = json.map(({ Title}) => Title )
              const year = json.map(({ Year}) => Year )
              const imdb = json.map(({ imdbID}) => imdbID )
              const poster = json.map(({ Poster}) => Poster )
              //var entry = `'${id}','${x}','${element[x]}'`
              //var entry = `'${element[x].Title}'`
              //let title = `${json[x].Title}`; //json[i].Title, 
              let ti = `${title[x]}`;
              //let year = `${json[x].Year}`; //json[i].Year, 
              let yr = `${year[x]}`;
              //let imdb = `${json[x].imdbID}`; //json[i].imdbID, 
              let Imdb = `${imdb[x]}`;
              //let poster = `${json[x].Poster}`; //json[i].Poster,
              let pos = `${poster[x]}`;

                  //const rate = readline.question(`Please enter rating in MongoDB for the movie ${movieTitle} you like it is`);
                  //if (rate != null) {
                      //console.log(`Your rating of this movie ${movieTitle} is ${rate}`);
                  //}
                  const mongo_username = 'lab5'  // update your username
                  const mongo_password = 'Abc123' // update your password
                  const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.aqj7cgz.mongodb.net/?retryWrites=true&w=majority`  //copy the path from your personal info registered on the online mongodb account
                  const DATABASE_NAME = "project" // Update your database name here
                  const USERCOLLECTION = "movie" // Update your collection name here
                  //Insert movie data to MongoDB
                  mongoClient.connect(CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true}) //{useNewUrlParser: true, useUnifiedTopology: true}
                  .then((db)=> { db.db(DATABASE_NAME).collection(USERCOLLECTION).insertOne({
                      Title: ti,
                      Year: yr,
                      imdbID: Imdb,
                      Poster: pos,
                      Rating: rate,
                      createdTime: HKtime
                  },(err) => {
                      if(err) {
                              console.log("status1: 500, description: ", err)
                      } else {
                              console.log(`status: 201, description: Movie of ${Title} inserted to MongoDB successfully`)
                      }
                  })
              })
              id++
            }
        })
    });
    const mongo_username = 'lab5'  // update your username
    const mongo_password = 'Abc123' // update your password
    const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.aqj7cgz.mongodb.net/?retryWrites=true&w=majority`  //copy the path from your personal info registered on the online mongodb account
    mongoClient.connect(CONNECTION_URI)
    .then((db) => {
        const DATABASE_NAME = "project" // Update your database name here
        const USERCOLLECTION = "movie" // Update your collection name here

        //Step 1: Find the collection (Database)
        db.db(DATABASE_NAME).collection(USERCOLLECTION).find({}).toArray((err, result) => {
        if(err) {
            res.status(500).send({"status":500, "description":err})//read error 500: content of mongodb error
        } else {
            //Step 3: response to client
            res.status(200).send(result)
        }
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send({"status": 500, "description": err})
    })
})

app.get('/film', (req, res)=> {
  console.log(`Someone request all movie records`)
  const mongo_username = 'lab5'  // update your username
  const mongo_password = 'Abc123' // update your password
  const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.aqj7cgz.mongodb.net/?retryWrites=true&w=majority`  //copy the path from your personal info registered on the online mongodb account
  const DATABASE_NAME = "project" // Update your database name here
  const USERCOLLECTION = "movie" // Update your collection name here
  //connect to monogoDB
  mongoClient.connect(CONNECTION_URI)
    .then((db) => {
      //Step 1: Find the collection
      db.db(DATABASE_NAME).collection(USERCOLLECTION).find({}).toArray((err, result) => {
          if(err) {
            res.status(500).send({"status": 500, "description": `Result Error: ${err}`})
          } else {
            // Step 3: response to client
            res.status(200).send(result)
          }
        })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({"status": 500, "description": err})
    })
})

app.get('/film/:title', (req, res) => {  
  const movieTitle = req.params.title
  const mongo_username = 'lab5'  // update your username
  const mongo_password = 'Abc123' // update your password
  const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.aqj7cgz.mongodb.net/?retryWrites=true&w=majority`  //copy the path from your personal info registered on the online mongodb account
  const DATABASE_NAME = "project" // Update your database name here
  const USERCOLLECTION = "movie" // Update your collection name here
  console.log(`Someone query the user record with movie title: ${movieTitle}`)
  mongoClient.connect(CONNECTION_URI)
    .then((db) => {
      //Step 1: Find the collection (Database)
      db.db(DATABASE_NAME).collection(USERCOLLECTION).find({'Title': movieTitle}).toArray((err, result) => {
        if(err) {
          res.status(500).send({"status":500, "description":err})//read error 500: content of mongodb error
        } else {
          //Step 3: response to client
          res.status(200).send(result)
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({'status': 500, "description": err}) //connect mongodb error
    })
})

//Insert comment
app.post('/addfilm', (req, res)=>{
  console.log('someone going to create a new movie record')
  //const username = (readline.question('Input user name :'))
  //const pwd = (readline.question('Input password :'))
  //const code = { 'username': username, 'pwd': pwd }
  const mongo_username = 'lab5'  // update your username
  const mongo_password = 'Abc123' // update your password
  const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.aqj7cgz.mongodb.net/?retryWrites=true&w=majority`  //copy the path from your personal info registered on the online mongodb account
  const DATABASE_NAME = "project" // Update your database name here
  const USERCOLLECTION = "movie" // Update your collection name here
  //insert items of each record in MongoDB.
  mongoClient.connect(CONNECTION_URI)
    .then((db)=> { db.db(DATABASE_NAME).collection(USERCOLLECTION).insertOne(
      {
        //$set:req.body,
        Title: req.body.Title,
        Year: req.body.Year,
        imdb: req.body.imdbID,
        Poster: req.body.Poster,
        Rating: req.body.Rating,
        CreatedTime: req.body.HKtime
      },                               
    {
      useUnifiedTopology: true
      //'username': username, 
      //'password':pwd
    },(err) => {
        if(err) {
          res.status(500).send({"status":500, "description":err})
        } else {
          res.status(201).send({"status":201, "description": "Data inserted successfully"})
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({'status': 500, "description": err}) 
    })

    //Add new movie record to SQLite3 Databse
      const Title = req.body.Title
      //const Year = res.send(req.body.Year)
      const Year = req.body.Year
      const imdb = req.body.imdbID
      const Poster = req.body.Poster

      const rate = readline.question(`Please enter rating for the movie ${Title} you like it is `);
      if (rate != null) {
          const RateMovie = rate.valueOf();
          console.log(`Your rating of this movie ${Title} is ${RateMovie}`);
      }

      const db = new SQLite3.Database( 'films.db', (err)=>{
          if ( err ){ console.log("Error connecting to database."); }
          db.run(`
          CREATE TABLE IF NOT EXISTS movies(
            id integer PRIMARY KEY AUTOINCREMENT,
            Title text,
            Year text,
            imdbID text,
            Poster text,
            Rating Int32,
            createDate TimeStamp
              )
              `, (err)=>{
                  if ( err ){
                      console.log( "Error creating table: ", err );
                  } else {
                      console.log( `Movie of ${Title} inserted in table of SQLite3 succesfully.` );
                  }
                  //db.close();
                  });
          });
          var entry = `'${Title}', '${Year}','${imdb}','${Poster}', '${rate}', '${HKtime}'` //strftime('%Y-%m-%d %H:%M:%S:%s')
          var sql = "INSERT INTO movies(Title, Year, imdbID, Poster, Rating, createDate) VALUES (" + entry + ")"
          
          //r = await sql.run(`${Title}`)
          var r = db.run(sql)
          //r = await sqlite.run(sql) //use const sqlite = require("aa-sqlite")
          if(r) console.log("Movie(s) " + Title + " was(were) inserted to SQLite3 DB.")
          //id++        
          //}
      

          var rows = db.all("SELECT id, Title FROM movies WHERE id = ?", [1])  // params must be iterable
          Object.keys(rows).forEach(key => {
              console.log("row_id is: ", rows[key].id);
              console.log("row_Title is: ", rows[key].Title);
          });

          //await db.each("SELECT * FROM lemon", [], function(row) {
          //console.log(row)
          //})
          //if(rows) console.log("row shown done.")
          db.close()
})

app.put('/film/:imdb', (req, res)=>{
  const ImdbMovie = req.params.imdb
  //const newvalues = { $set: {'username': username, 'password': } };
  //const username = (readline.question('Input user name :'))
  //const pwd = (readline.question('Input new password :'))
  const filter = {"imdbID": ImdbMovie}
  //const update = {"$set":{"password": newpassword}}
  const update = {"$set": req.body}
  //const update = {"password": newpassword}
  //const options = { returnNewDocument: true }
  const options = { "_id": 1, "password": 1 }
  
  mongoClient.connect(CONNECTION_URI)
  .then((db)=>{
    db.db(DATABASE_NAME).collection(USERCOLLECTION).findOneAndUpdate(filter,update,options,(err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
            console.log(`Can't updated user password of ${ImdbMovie}`)
          } else {
            res.status(201).send({"status":201, "description": "Updated user account password of " + username + " successfully"})
            console.log(`Updated user password of ${ImdbMovie} successfully`)
          }
        })
  })
  .catch((err) => {
      console.log(err)
      res.status(500).send({'status': 500, "description": err}) 
  })
})

app.delete('/removefilm/:Imdb', (req, res)=>{
  const imdb = req.params.Imdb
  console.log(`delete the movie of ${imdb}`)
  mongoClient.connect(CONNECTION_URI)
    .then((db)=>{
      db.db(DATABASE_NAME).collection(USERCOLLECTION)      .deleteOne({'imdbID': imdb},
        (err) => {
          if(err) {
            res.status(500).send({"status":500, "description":err})
          } else {
            res.status(201).send({"status":201, "description":"Movie of " + imdb + " record was deleted successfully"})
          }
        })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({'status': 500, "description": err}) 
    })    
})

app.listen(10889, () => {
  console.log('Server is ready at port of 10889.')
})
