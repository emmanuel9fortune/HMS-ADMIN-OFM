// inpatientBill

const express = require('express');
const router = express.Router();
const { billRequests, Patient, notifications, prescribes } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const id = req.body.id
        const docID = req.body.docID
        const services = req.body.services
        const oid = req.body.oid

        if(docID){
            await billRequests.create({
                uid,
                doctorID: docID,
                services,
                status: 'AWAITING',
                type: 'doctor',
                timeStamp : new Date().getTime(),
                preTime: new Date().getTime(),
                id,
                oid,
            }) 
        }else{ 
            await billRequests.updateOne(
                {_id:id, uid},
                {$set:{status:'AWAITING'}}
            ) 
        }


        await prescribes.updateOne(
            {_id: id},
            {$set: {status: 'closed', tag:'nurse', flag: 'Approved'}}
        ) 

        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Drug Request Sent !!`)

        const notify =  await notifications.findOne({uid})

        if(notify){
            await notifications.updateOne(
                {uid: uid},
                {$set: {
                    role: 'pharmacy',
                    type: 'New Requests',
                    message: `Doctor Request for`,
                    timeStamp : new Date().getTime(),
                    tag: 'PAID'
                }}
            )
        }else{
            await notifications.create({
                uid: uid,
                role: 'pharmacy',
                type: 'New Requests',
                message: `Doctor Request for`,
                timeStamp : new Date().getTime(),
                tag: 'PAID'
            })
        }

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;