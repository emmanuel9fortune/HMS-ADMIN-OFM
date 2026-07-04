const express = require('express');
const router = express.Router();
const { billRequests, util, Patient, notifications } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const nurseID = req.body.nurseID
        const services = req.body.services
        const cartItems = req.body.cartItems
        const type = req.body.type
        const oid = req.body.oid

        if(type === 'con'){
            await billRequests.create({
                uid,
                nurseID,
                services,
                oid,
                status: 'AWAITING',
                type: 'nurse',
                timeStamp : new Date().getTime()
            })
        }else if(type === 'adm'){
            await billRequests.create({
                uid,
                nurseID,
                services,
                oid,
                status: 'APPROVE',
                type: 'nurse',
                lag:'out',
                timeStamp : new Date().getTime()
            })
        }else if(type === 'consume'){
            await billRequests.create({
                uid,
                nurseID,
                services,
                oid,
                status: 'PENDING',
                type: 'nurse',
                lag:'out',
                timeStamp : new Date().getTime()
            })
        }else{
            await billRequests.create({
                uid,
                nurseID,
                services,
                oid,
                status: 'PENDING',
                type: 'nurse',
                timeStamp : new Date().getTime()
            })
        }

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
        
        if(type !== 'utils' || type !== 'adm'){
            const io = getIO()
            io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Consumable Request !!`)
        }else{
            const io = getIO()
            io.to("cashier").emit("message", `Patient ${getpatientName?.name} Bill Sent !!`)
        }
        
        const notify =  await notifications.findOne({uid})

        if(type !== 'utils'){
            if(notify){
                await notifications.updateOne(
                    {uid: uid},
                    {$set: {
                        role: 'pharmacy',
                        type: 'New Request',
                        message: `Nurse Request for`,
                        timeStamp : new Date().getTime(),
                        tag:'PAID'
                    }}
                )
            }else{
                await notifications.create({
                    uid: uid,
                    role: 'pharmacy',
                    type: 'New Request',
                    message: `Nurse Request for`,
                    timeStamp : new Date().getTime(),
                    tag:'PAID'
                })
            }
        }else{
            if(notify){
                await notifications.deleteOne(
                    {uid: uid}
                ) 
            }
        }
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;