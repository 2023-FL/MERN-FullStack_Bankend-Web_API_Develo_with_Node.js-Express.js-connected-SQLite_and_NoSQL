const express = require("express")
const router = express.Router()
const Controller = require("../controller/filmController.js")

router.get('/filmrecord/:keyword', Controller.getOMDb)//Get all records of films with OMDb api
router.get('/film/:film', Controller.getFilm) // Get one record of film
router.get('/list', Controller.listFilm) // List all fil records
router.post('/film', Controller.addFilm) //Create a new record of film record
router.delete('/removefilm', Controller.removefilm) //Delete an existing film record


module.exports = router 