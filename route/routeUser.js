const express = require("express")
const router = express.Router()

//------------ Importing Controllers ------------//
const authController = require("../controller/authController")

//router.post('/auth', authController.auth) //Login an existing user account
//router.post('/apply', authController.adduser) //Create a new user account
//router.put('/update', authController.updateuser) //Update an existing user record
//router.delete('/removeuser', authController.removeuser) //Delete an existing user record


//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));

//------------ Forgot Password Route ------------//
router.get('/forgot', (req, res) => res.render('forgot'));

//------------ Reset Password Route ------------//
router.get('/reset/:id', (req, res) => {
    // console.log(id)
    res.render('reset', { id: req.params.id })
});

//------------ Register Route ------------//
router.get('/apply', (req, res) => res.render('register'));

//------------ Register POST Handle ------------//
router.post('/apply', authController.registerHandle);

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateHandle);

//------------ Forgot Password Handle ------------//
router.post('/forgot', authController.forgotPassword);

//------------ Reset Password Handle ------------//
router.post('/reset/:id', authController.resetPassword);

//------------ Reset Password Handle ------------//
router.get('/forgot/:token', authController.gotoReset);

//------------ Login POST Handle ------------//
router.post('/login', authController.loginHandle);

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);

module.exports = router;