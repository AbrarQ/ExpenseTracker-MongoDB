const mongoose = require('mongoose')

const users = require('../models/userLoginsModel')
const sequelize = require('../util/dbConnection');
const expensesModel = require('../models/expensesModel');
/**
 * HOME FOR Expense ROUTES
 * ADD EXPENSE
 * GET EXPENSE
 * DELETE EXPENSE
 */

exports.addExpense = async (req, res, next) => {

    const session = await mongoose.startSession()

    session.startTransaction()

    try {
        console.log("entering add expense")
        console.log(req.user.id)
        // console.log("total amount", req.user, req.body.amount)
        const expense = new expensesModel({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category,
            userid: req.user.id
        })

        await expense.save({ session }).then(async (data) => {
            console.log("i am data wala", data)
           const total= ((+req.user.totalExp) + (+req.body.amount))
            console.log(total)
            const filterby = { _id: req.user._id }
            const totalExp = {  totalExp: total  }
            

            await users.findOneAndUpdate(filterby, totalExp,{ session })
            .then(async () => {
                await session.commitTransaction();
                console.log(data)
                res.status(200).json(data)
            })
        })


    } catch (err) {
        await session.abortTransaction()
    } finally {
        session.endSession()
    }
}




// router.get('/get-expense',
exports.getExpense = async (req, res, next) => {
    try {
        const PAGE = +req.query.page || 1

        const ITEMS_PER_PAGE = +req.query.count || 5;
        // console.log("items per ppage",ITEMS_PER_PAGE)
        // console.log("this is my page num", PAGE);
        const USER = req.user.id
        console.log(req.user.id)


        const count = await expensesModel.count({  userid: USER })

        console.log("Number of records", count);


        const pageData = await expensesModel.find({ userid: USER })
        .limit(ITEMS_PER_PAGE)
        .skip((PAGE - 1) * ITEMS_PER_PAGE)
      
        .then((rows) => {
            res.json({
                rows: rows,
                currentpage: PAGE,
                hasnextpage: ITEMS_PER_PAGE * PAGE < count,
                nextpage: PAGE + 1,
                haspreviouspage: PAGE > 1,
                previouspage: PAGE - 1,
                lastpage: Math.ceil(count / ITEMS_PER_PAGE)

            })
            return rows.data
        })
        .catch(err => console.log(err))
        // console.log(JSON.stringify(pageData))
    } catch (err) { console.log(err); console.log("error at get expense") }








}



// router.delete('/del-expense/:id',
exports.delExpense = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();

        const expID = req.params.id;

        console.log(req.user.totalexp);
        console.log(expID);


        const val = await expensesModel.findAll( { _id: expID } )

        const check = JSON.stringify(val);
        const final = JSON.parse(check)
        const delAmount = final[0].amount;
        console.log(delAmount)


        const ab = await expensesModel.destroy({ where: { id: expID } }, { transaction: t })
            .then(data => {

                const totalExp = Number(req.user.totalexp) - Number(delAmount)

                loginModel.update({ totalexp: totalExp }, {
                    where: { id: req.user.id }, transaction: t
                }).then(async () => {
                    await t.commit();
                    res.status(200).json({ data: data, message: "Expense Deleted" })
                })
                    .catch(async (err) => {
                        await t.rollback();
                        res.status(500).json({ error: err, message: "Deletion Failure" })
                    })
            })
            .catch(async (err) => {
                await t.rollback();
                res.status(500).json({ error: err, message: "Deletion Failure" })
            })
    } catch (err) { console.log(err); console.log("error at del expense ") }

}
