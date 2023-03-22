const express = require('express');
const router = express.Router();
const signinControl = require('../controllers/signinController');

router.post('/user', signinControl.getUsers);

module.exports = router;



