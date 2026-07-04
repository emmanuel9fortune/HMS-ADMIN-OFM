const express = require('express');
const router = express.Router();
const { billRequests, Patient, notifications} = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {

    const uid = req.body.uid
    const billId = req.body.billId
    const tag = req.body.tag

    try {
        if(tag === 'PAID'){
            await billRequests.updateOne({uid, _id:billId },{status:'PAID'})
        }else{
            await billRequests.updateOne({uid, _id:billId },{status:'PENDING', tagged:'PAID'})
        }
        
        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("cashier").emit("message", `Patient ${getpatientName?.name} Bill Sent !!`)
        io.to("receptionist").emit("message", `Patient ${getpatientName?.name} Bill Sent !!`)

        await notifications.deleteOne({uid: uid})

        if(getpatientName?.status !== 'admitted'){
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
        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;