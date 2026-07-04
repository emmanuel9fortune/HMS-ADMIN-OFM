// decline
const express = require('express');
const router = express.Router();
const { prescribes, util, notifications, Patient, billRequests } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const id = req.body.id
        const cartItems = req.body.items

        const getOpenedPrescription = await prescribes.findOne({uid, status:'open'})

        if(!id){
            await prescribes.updateOne(
                { _id: getOpenedPrescription?._id },
                {$set: {status: 'close', flag: 'Declined', tag:'doctor'}}
            ) 
        }else{
            await billRequests.deleteOne({_id:id, uid}) 
        }

        for(let item of cartItems ){
            await util.findOneAndUpdate(
                {
                    _id: item.id,
                    quantity: {$gte: item.quantity}
                },
                {
                    $inc:{quantity: +item.quantity}
                }
            )
        }
        
        await notifications.deleteOne({uid})    
        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("doctor").emit("message", `Patient ${getpatientName?.name} Drug Request Decline !!`)
        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;