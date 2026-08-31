const express = require('express');
const router = express.Router();
const { vital, notifications, Patient, queue } = require('../../model');
const mongoose = require('mongoose');
const { getIO } = require('../../socketManager');

router.post('/', async (req, res) => {
    try {
        const { uid, formFields } = req.body;

        if (!uid || !Array.isArray(formFields)) {
            return res.status(400).json({ status: 'error', message: 'Invalid request data' });
        }

        const toUpdate = formFields.filter(item => item?._id);
        const toAdd = formFields.filter(item => !item?._id);

        const existingVital = await vital.findOne({ uid });

        if (existingVital) {
            // Update existing vitals            
            const getpatientName = await  Patient.findOne({_id:uid})
            const io = getIO()
            io.to("doctor").emit("message", `Patient ${getpatientName?.name} Awaiting Consultation !!`)
            
            const notify =  await notifications.findOne({uid})

            if(notify){
                await notifications.updateOne(
                    {uid: uid},
                    {$set: {
                        role: 'doctor',
                        type: 'Cunsultation',
                        message: `Patient Awaiting Cunsultation`,
                        timeStamp : new Date().getTime()
                    } }
                )
            }else{
                await notifications.create({
                    uid: uid,
                    role: 'doctor',
                    type: 'Cunsultation',
                    message: `Patient Awaiting Cunsultation`,
                    timeStamp : new Date().getTime()
                })
            }

            for (const item of toUpdate) {
                await vital.updateOne(
                    { uid, "vitals._id": item._id },
                    { $set: { "vitals.$": item } }
                );
            }

            // Add new vitals
            if (toAdd.length > 0) {
                const enriched = toAdd.map(op => ({ ...op, _id: new mongoose.Types.ObjectId() }));

                await vital.updateOne(
                    { uid },
                    { $push: { vitals: { $each: enriched } } }
                );
            }

            await queue.deleteOne({patientID: uid})


            return res.json({ status: 'success' });
        } else { 
            // Create new vital document
            const enriched = formFields.map(op =>
                op._id ? op : { ...op, _id: new mongoose.Types.ObjectId() }
            );

            await vital.create({
                uid,
                vitals: enriched
            });

            const getpatientName = await  Patient.findOne({_id:uid})
            const io = getIO()
            io.to("doctor").emit("message", `Patient ${getpatientName?.name} Awaiting Consultation !!`)
            
            const notify =  await notifications.findOne({uid})

            if(notify){
                await notifications.updateOne(
                    {uid: uid},
                    {$set: {
                        role: 'doctor',
                        type: 'Cunsultation',
                        message: `Patient Awaiting Cunsultation`,
                        timeStamp : new Date().getTime()
                    } }
                )
            }else{
                await notifications.create({
                    uid: uid,
                    role: 'doctor',
                    type: 'Cunsultation',
                    message: `Patient Awaiting Cunsultation`,
                    timeStamp : new Date().getTime()
                })
            }
            
            await queue.deleteOne({patientID: uid})

            return res.json({ status: 'success' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
