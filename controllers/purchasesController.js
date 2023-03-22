// const Razorpay = require('razorpay');
const orderModel = require('../models/ordersModel')
const users = require('../models/userLoginsModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


// function generateAuthToken(uid) {
//     return new jwt.sign({ userId: uid, ispremium: "1" }, process.env.JWT_SECRET_KEY)
// }
function generateAuthToken(id, key) {
    console.log(id,key)

    console.log( jwt.sign({ userId: id, ispremium: key }, process.env.JWT_SECRET_KEY))

    try {
        return jwt.sign({ userId: id, ispremium: key }, process.env.JWT_SECRET_KEY)
    } catch(err){
        console.log(err)
    }
    
}

/**
 * HOME FOR PREMIUM ROUTES
 * PURCHASE PREMIUM
 * POST TRANSACTION
 * MAKING USER PREMIUM
 */


exports.purchasePremium = async (req, res, next) => {
    try {
        console.log("Entering Purchase Section")

        var rzr = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET

        })

        const amount = 250000;

        //We create the oder for amount of thi currency
        const orderid = await rzr.orders.create({ amount, currency: 'INR' });
        //  console.log(orderid.id)

        console.log(req.user._id.toString())



        const orders = new orderModel({
            orderid: orderid.id,
            status: "pending",
            userid: req.user._id.toString()
        })


        await orders.save()
            .then(() => {
                console.log("Saved orderid")
                res.status(201).json({ orderid, key_id: rzr.key_id })
            })
            .catch(async (err) => res.status(500).json({ err, message: false }))

    }
    catch (err) {
        console.log(err);
        console.log("error in ourchase")
    }
}


exports.postTransaction = async (req, res, next) => {
    console.log("enteringPost Transact")
    console.log(req.body);
    console.log(req.user.id)
    
        const status = req.body.status;
        console.log(status)


        if (status === "Success") {

            const session = await mongoose.startSession()
            session.startTransaction()
            try {
                const filterby = { userid: req.user._id.toString() }
                const updateStatus = {
                    paymentid: req.body.payment_id,
                    status: status,
                }
                await orderModel.findOneAndUpdate(filterby, updateStatus).session(session)
                    .then(async (data) => {
                            console.log("data in first",data)
                        const filterby = { _id: req.user._id.toString() }
                        console.log(filterby, "filterby")
                        const updateStatus = { ispremium: 1 }

                        await users.findOneAndUpdate(filterby, updateStatus).session(session)
                        .then(async () => {
                            await session.commitTransaction()
                         res.status(200).json({ token: generateAuthToken(req.user.id, "True"), message: "You are a premium user now" })
                        })
                    })


            } catch (err) {
                console.log(err)
                await session.abortTransaction()
            } finally {
                session.endSession()
            }

            // res.status(200).json({ token: generateAuthToken(req.user._id.toString(), "True"), message: "You are a premium user now" })}
            // .catch(async (err) => console.log(err))

        } else {
            console.log("entering failed")
            const filterby = { userid: req.user._id.toString() }
            console.log(filterby, "filterby")

            const updateStatus = {
                status: status,
            }
            console.log(updateStatus, "filterby")
          
            await orderModel.findOneAndUpdate(filterby, updateStatus).then((failed)=>{
                    console.log(failed)
            })
                .catch(async (err) => console.log(err))
            res.status(402).json({ token: generateAuthToken(req.user.id, "False"), message: "Payment Failed" });
        }




    }




