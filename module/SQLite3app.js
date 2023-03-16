'use strict'
const request = require('request');
const express = require("express");
const path = require("path");

const datetime = require('date-and-time')
const { findTimeZone, getZonedTime } = require('timezone-support')
//const dateUtc = zonedTimeToUtc(datetime, 'Asia/Hong_Kong')
const readline = require('readline-sync');

//const nativeDate = new Date()
//const HKtime = getZonedTime(nativeDate, hongkong)
var moment = require('moment-timezone');
const HKtime = moment().tz("Asia/Hong_Kong").format();

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
let database = null;
const dbPath = path.join(__dirname, "films.db");
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3004, () => {
      console.log("Server is running on http://localhost:3004");
    });
  } catch (error) {
    console.log(`Data base error is ${error}`);
    process.exit(1);
  }
};
initializeDbAndServer();

// get the list of all the movies in the database (movies table)
// API 1a
const ConvertMovieDbAPI1 = (objectItem) => {
  return {
    Title: objectItem.Title,
    Year: objectItem.Year,
    imdbID: objectItem.imdbID,
    Poster: objectItem.Poster,
    Rating: objectItem.Rating,
    createdDate: HKtime,
  };
};

//Get the film information from OMDb API (you need to apply a key and study the documentation) 
app.get('/filmrecord/:movietitle', (req, res)=> {
  const movieTitle = req.params.movietitle

let key = "bff6445f";
const url = `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${movieTitle}`

  request.get(url, (err, res, body)=> {
    console.log("err: ", err)
    //if (err) reject(new Error('invalid API call'))
    console.log("body: ", body)
    const json = JSON.parse(body).Search
    const result = JSON.stringify(json) //make array to become json array
    const title = json.map(({ Title }) => Title )
    const year = json.map(({ Year }) => Year )
    const imdb = json.map(({ imdbID}) => imdbID )
    const poster = json.map(({ Poster }) => Poster )
    console.log("poster is: ", poster)

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

      const db = new sqlite3.Database( 'films.db', (err)=>{
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
      });
  });
});

//Retrieve the film information from the SQLite3 database
app.get("/list/", async (request, response) => {
  const getMoviesListQuery = `select * from movies;`;
  const getMoviesListQueryResponse = await database.all(getMoviesListQuery);
  response.send(
    getMoviesListQueryResponse.map((eachMovie) => ConvertMovieDbAPI1(eachMovie))
  );
});


//API 2
// create a movie in movies table in moviesData.db
app.post("/addfilm/", async (request, response) => {
  /*const db = new sqlite3.Database( 'films.db', (err)=>{
    if ( err ){ console.log("Error connecting to database."); }
    console.log("Successfully connected to SQLite3")
    });
  var entry = `'${Title}', '${Year}','${imdb}','${Poster}', '${rate}', '${HKtime}'` //strftime('%Y-%m-%d %H:%M:%S:%s')
  var sql = "INSERT INTO movies(Title, Year, imdbID, Poster, Rating, createDate) VALUES (" + entry + ")"
          
  //r = await sql.run(`${Title}`)
  var r = await db.run(sql)
  //r = await sqlite.run(sql) //use const sqlite = require("aa-sqlite")
  if(r) console.log("Movie(s) " + Title + " was(were) inserted to SQLite3 DB.")
  await db.close()*/
  const { Title, Year, imdbID, Poster, Rating, createDate } = request.body;
  const createMovieQuery = `insert into movies(Title,Year,imdbID,Poster,Rating,createDate)
  values ('${Title}','${Year}','${imdbID}','${Poster}','${Rating}','${HKtime}');`;
  const createMovieQueryResponse = await database.run(createMovieQuery);
  response.send(`Movie of ${Title} Was Successfully Added`);
});

//API 3
//Returns a movie based on the movie ID
const ConvertMovieDbAPI3 = (objectItem) => {
  return {
    Title: objectItem.Title,
    Year: objectItem.Year,
    imdbID: objectItem.imdbID,
    Poster: objectItem.Poster,
    Rating: objectItem.Rating,
    createdDate: HKtime,
  };
};
// Get film with film ID from SQLite3 Database
app.get("/film/:imdb/", async (request, response) => {
  const { imdb } = request.params;
  const getMovieDetailsQuery = `select * from movies where imdbID = '${imdb}';`;
  const getMovieDetailsQueryResponse = await database.get(getMovieDetailsQuery);
  response.send(ConvertMovieDbAPI3(getMovieDetailsQueryResponse));
});

//API 4
//Updates the details of a movie in the movie table based on the movie ID
app.put("/film/:imdb/", async (request, response) => {
  const { imdb } = request.params;
  const { Title, Year, imdbID, Poster, Rating, createDate } = request.body;
  const updateMovieQuery = `update movies set Title = '${Title}', Year = '${Year}', imdbID = '${imdbID}', Poster = '${Poster}', Rating = '${Rating}', createDate = '${HKtime}' where imdbID = '${imdb}';`;
  const updateMovieQueryResponse = await database.run(updateMovieQuery);
  response.send(`Movie Details of ${Title} Was Updated`);
});

//API 5
//Deletes a movie from the movie table based on the movie ID
app.delete("/removefilm/:imdb/", async (request, response) => {
  const { imdb } = request.params;
  const deleteMovieQuery = `delete from movies where imdbID = '${imdb}';`;
  const deleteMovieQueryResponse = await database.run(deleteMovieQuery);
  response.send(`Movie of ${imdb} Was Removed`);
});

module.exports = app;
