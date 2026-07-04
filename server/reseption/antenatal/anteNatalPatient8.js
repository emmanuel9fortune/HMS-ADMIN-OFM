const express = require('express');
const router = express.Router();
const { antenatal, notifications, Patient} = require('../../../model');
const { getIO } = require('../../../socketManager');

router.post('/', async(req, res) => {
    try {

        const { 
            specialInstruction,
            uid
        } = req.body

        await antenatal.updateOne(
            { uid },
            {
                $set:{
                    specialInstruction: specialInstruction || '',
                }
            }
        );

    
        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("nurse").emit("message", `Ante Natal Patient ${getpatientName?.name} Awaiting Vital Tests !!`)
        
        const notify =  await notifications.findOne({uid})

        if(notify){
            await notifications.updateOne(
                {uid: uid},
                {$set: {
                    role: 'nurse',
                    type: 'New Patient',
                    message: `Patient Awaiting Vitals`,
                    timeStamp : new Date().getTime()
                }}
            )
        }else{
            await notifications.create({
                uid: uid,
                role: 'nurse',
                type: 'New Patient',
                message: `Patient Awaiting Vitals`,
                timeStamp : new Date().getTime()
            })
        }
        
        await Patient.updateOne(
            {_id:uid},
            {$set: {status: 'nurse'}}
        )

        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;