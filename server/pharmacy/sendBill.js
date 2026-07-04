const express = require('express');
const router = express.Router();
const { billRequests, util, Patient, notifications } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const staffID = req.body.staffID
        const services = req.body.services
        const cartItems = req.body.cartItems

        await billRequests.create({
            uid,
            staffID,
            services,
            status: 'PENDING',
            type: 'pharmacy',
            timeStamp : new Date().getTime(),
        })

        for(let item of cartItems ){
            await util.findOneAndUpdate(
                {
                    _id: item.id,
                    quantity: {$gte: item.quantity}
                },
                {
                    $inc:{quantity: -item.quantity}
                }
            )

        }

        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("cashier").emit("message", `Patient ${getpatientName?.name} Bill Sent !!`)
        io.to("receptionist").emit("message", `Patient ${getpatientName?.name} Bill Sent !!`)

        const notify =  await notifications.findOne({uid})

        if(notify){
            await notifications.deleteOne(
                {uid: uid}
            )
        }

        if(getpatientName?.status !== 'admitted'){
            if(getpatientName?.status !== 'emergency'){
                await Patient.updateOne(
                    {_id:uid},
                    {$set: {status: 'cashier'}}
                )
            }else{
                await Patient.updateOne(
                    {_id:uid},
                    {$set: {status: getpatientName?.status}}
                )
            }
        }else{
            await Patient.updateOne(
                {_id:uid},
                {$set: {status: getpatientName?.status}}
            )
        }

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;