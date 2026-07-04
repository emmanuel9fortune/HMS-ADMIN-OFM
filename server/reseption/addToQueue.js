const express = require('express');
const router = express.Router();
const { queue, notifications, Patient } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
            const uid = req.body.uid

            const queued =  await queue.findOne({patientID: uid})

            if(queued){
               return res.json({status:'error', message:'Patient Already in Queue'})
            }
             await Patient.updateOne(
                {_id: uid},
                {$set: {status: 'nurse'}}
             )

            await queue.create({
                patientID: uid,
                timeStamp: new Date().getTime(),
            })

            const getpatientName = await  Patient.findOne({_id:uid})
            const io = getIO()
            io.to("nurse").emit("message", `Patient ${getpatientName?.name} Awaiting Vital Tests !!`)

            
            const notify =  await notifications.findOne({uid})

            if(notify){
                await notifications.updateOne(
                    {uid: uid}, 
                    {$set: {
                        role: 'nurse',
                        type: 'Patient in Queue',
                        message: `Patient Awaiting Vitals`,
                        timeStamp : new Date().getTime()
                    }}
                )
            }else{
                await notifications.create({
                    uid: uid,
                    role: 'nurse',
                    type: 'Patient in Queue',
                    message: `Patient Awaiting Vitals`,
                    timeStamp : new Date().getTime()
                })
            }

            res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;