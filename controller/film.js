const mongoClient = require("mongodb").MongoClient

const mongo_username = ''  // update your username
const mongo_password = '' // update your password

const CONNECTION_URI = `mongodb+srv://${mongo_username}:${mongo_password}@`  //Update the path
const DATABASE_NAME = "" // Update your database name here
const FILMCOLLECTION = "" // Update your collection name here

const Controller = {
/**
 * Get all films with OMDb api
 * @param {Obkect} req - Not required
 * @param {Object} res - Return the information
**/
  getOMDb (req, res)  {
  res.send({"t": 'list all film'})
  },
  /**
 * Get record among films
 * @param {Obkect} req - Not required
 * @param {Object} res - Return the information
**/
  getFilm (req, res)  {  
    res.send({"t": 'get film'})
  },
/**
 * Add new record of film
 * @param {Obkect} req - Not required
 * @param {Object} res - Return the information
**/
  addFilm (req, res)  {  
    res.send({"t": 'add film'})
  },
/**
 * List all films
 * @param {Obkect} req - Not required
 * @param {Object} res - Return the information
**/
  listFilm (req, res){
    res.send({"t": 'list all film'})
  },
}
module.exports = Controller