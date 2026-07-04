const express = require('express');
const router = express.Router();
const { billRequests, util, Patient, notifications, prescribes } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const id = req.body.id
        const docID = req.body.docID
        const services = req.body.services 
        const cartItems = req.body.cartItems
        const instruction = req.body.instruction
        const oid = req.body.oid

        await billRequests.create({
            uid,
            doctorID: docID,
            services,
            status: 'AWAITING',
            type: 'doctor',
            timeStamp : new Date().getTime(),
            instruction: instruction || '---',
            preTime: new Date().getTime(),
            oid
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

        await prescribes.updateOne(
            {_id: id},
            {$set: {status: 'closed'}}
        )

        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Prescription Sent !!`)
        io.to("nurse").emit("message", `Patient ${getpatientName?.name} Prescription Sent !!`)

        const notify =  await notifications.findOne({uid})

        if(notify){
            await notifications.updateOne(
                {uid: uid},
                {$set: {
                    role: 'pharmacy',
                    type: 'New Requests',
                    message: `Prescriptions for`,
                    timeStamp : new Date().getTime(),
                    tag:'PAID'
                }}
            )
        }else{
                await notifications.create({
                    uid: uid,
                    role: 'pharmacy',
                    type: 'New Requests',
                    message: `Prescriptions for`,
                    timeStamp : new Date().getTime(),
                    tag:'PAID'
                })
            }

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;