const express = require('express');
const router = express.Router();
const uuidMiddleware = require('../middleware/uuidFunctions');
const passwordController = require('../controllers/passwordsController');


router.post('/forgotpassword',uuidMiddleware.uuidDbCheck, passwordController.passwordEmailer);

router.get('/resetpassword/:uuid', passwordController.sendhtml );
    
router.post('/updatepassword', passwordController.storepass );








module.exports = router;



// router.get('/Setpass.js', resetControl.sendjs);