const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premiumController');
const tokenAuthentication = require('../middleware/tokenAuth');



router.get('/leaderboard',tokenAuthentication.authenticate,premiumController.getLeaderBoard);
router.get('/download', tokenAuthentication.authenticate , premiumController.downloadExpenseFile);
router.get('/downloadlist', tokenAuthentication.authenticate , premiumController.downloadsList);
router.get('/userverify', tokenAuthentication.verification);

module.exports = router;
