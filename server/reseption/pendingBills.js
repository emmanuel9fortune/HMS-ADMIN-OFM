// pendingBills
const express = require('express');
const router = express.Router();
const { billRequests, Patient, request } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const billId = req.body.billId
        const mode = req.body.mode
        const type = req.body.type
        const staff = req.body.staff

        const getID = await billRequests.findOne({uid, _id:billId })
        await request.updateOne(
            {_id: getID?.approve},
            {$set: {status: 'PENDING'}}
        )

        if(type === 'doctor' && getID?.instruction){
            await billRequests.updateOne({uid, _id:billId },{status:'PENDING', mode, timeStamp: new Date().getTime(), tag:'PENDING', staff})
        }else{
            await billRequests.updateOne({uid, _id:billId },{status:'PENDING', mode, timeStamp: new Date().getTime(), tag:'PENDING', staff})
        }


        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        if(type === 'doctor'){
            io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Prescription Request Pending !!`)
        }
        if(type === 'nurse'){
            io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Consumables Pending !!`)
        }
        if(type === 'lab' || type === 'scan'){
            io.to("laboratory").emit("message", `Patient ${getpatientName?.name} Bill Pending !!`)
        }
        
        
        return res.json({status:'success'}) 

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;