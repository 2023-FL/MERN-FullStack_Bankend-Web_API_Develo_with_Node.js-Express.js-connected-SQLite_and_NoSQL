const express = require("express")
const router = express.Router()
//const controller = require("../controller/filmcontroller.js")
const userController = require("../controller/usercontroller.js")
const filmController = require("../controller/filmcontroller.js")

router.use('/', userController.route)
router.use('/', filmController.route)

module.exports = router