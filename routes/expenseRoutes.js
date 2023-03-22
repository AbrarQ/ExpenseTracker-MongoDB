const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseContoller');
const tokenAuthentication = require('../middleware/tokenAuth');

router.post('/add-expense',tokenAuthentication.authenticate ,expenseController.addExpense);
router.get('/get-expense', tokenAuthentication.authenticate , expenseController.getExpense);
router.delete('/delete-expense/:id', tokenAuthentication.authenticate,expenseController.delExpense);

module.exports = router;

