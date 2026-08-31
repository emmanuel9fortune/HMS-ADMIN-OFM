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
        const tag = req.body.tag
        const oid = req.body.oid

        if(tag){
            await billRequests.create({
                uid,
                doctorID: docID,
                services,
                status: 'PAID',
                type: 'doctor', 
                timeStamp : new Date().getTime(),
                instruction: instruction || '---',
                preTime: new Date().getTime(),
                oid
            })
            
            for(let item of cartItems ){ 
                await util.findOneAndUpdate(
                    {
                        _id: item.id
                    },
                    {
                        $inc:{quantity: -item.quantity}
                    }
                )
            }

            return res.json({status:'success'})
        }else{
            await billRequests.create({
                uid,
                doctorID: docID,
                services,
                status: 'PENDING',
                type: 'doctor', 
                timeStamp : new Date().getTime(),
                instruction: instruction || '---',
                preTime: new Date().getTime(),
                oid
            })

            for(let item of cartItems ){ 
                await util.findOneAndUpdate(
                    {
                        _id: item.id
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
            io.to("cashier").emit("message", `Patient ${getpatientName?.name} Prescription Blll Sent !!`)
            io.to("receptionist").emit("message", `Patient ${getpatientName?.name} Prescription Blll Sent !!`)

            const notify =  await notifications.findOne({uid})

            if(notify){
                await notifications.deleteOne(
                    {uid: uid}
                )
            }
            
            return res.json({status:'success'})
        }


    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;