const express = require('express');
const router = express.Router();
const { prescribes, Patient, notifications } = require('../../model');
const mongoose = require('mongoose');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {

        const { 
            formFields, 
            uid,
        } = req.body
        

        const getprescribes = await prescribes.findOne({uid})

        if(getprescribes){
            const getID = formFields?.map((item)=> item?._id)
            const toUpdate = formFields?.filter((item)=> item?._id)
            const toAdd = formFields?.filter((item)=> !item?._id)



        if(getID){
            for(const item of toUpdate){
                await prescribes.updateOne(
                    {uid, "prescribe._id": item._id},
                    {
                        $set: {"prescribe.$": item, timestamp: new Date().getTime()},
                    }
                )
            } 

            if(toAdd.length > 0){
                const enriched = toAdd.map(item => ({ ...item, _id: new mongoose.Types.ObjectId() }))
                await prescribes.updateOne(
                    {uid},
                    {
                        $push: {prescribe: {$each: enriched}},
                        $set: {timestamp: new Date().getTime()}
                    }
                )
            }
        }
        }else{
            await prescribes.create({
                uid,
                timestamp: new Date().getTime(), 
                prescribe: formFields
            })
        } 

        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Awaiting Vital Tests !!`)
        
        const notify =  await notifications.findOne({uid})

        if(notify){
            await notifications.updateOne(
                {uid: uid},
                {$set: {
                    role: 'pharmacy',
                    type: 'New Prescription',
                    message: `Patient Awaitin Prescriptions`,
                    timeStamp : new Date().getTime()
                }}
            )
        }else{
            await notifications.create({
                uid: uid,
                role: 'pharmacy',
                type: 'New Prescription',
                message: `Patient Awaitin Prescriptions`,
                timeStamp : new Date().getTime()
            })
        }

        
        if(getpatientName?.status !== 'admitted'){
            await Patient.updateOne(
                {_id:uid},
                {$set: {status: 'pharmacy'}}
            )
        }else{
            await Patient.updateOne(
                {_id:uid},
                {$set: {status: getpatientName?.status}}
            )
        }


        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;