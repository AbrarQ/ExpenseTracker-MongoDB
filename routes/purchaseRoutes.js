const express = require('express');
const purchaseController = require('../controllers/purchasesController');
const tokenAuthentication = require('../middleware/tokenAuth');
const router = express.Router()

router.get('/premium', tokenAuthentication.authenticate, purchaseController.purchasePremium)
router.post('/updatetransactionstatus', tokenAuthentication.authenticate, purchaseController.postTransaction)

module.exports = router;

