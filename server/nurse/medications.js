const express = require('express');
const router = express.Router();
const { medications, queue } = require('../../model');
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

        const existingmedication = await medications.findOne({ uid });

        if (existingmedication) {
            // Update existing medications
            for (const item of toUpdate) {
                await medications.updateOne(
                    { uid, "medications._id": item._id }, 
                    { $set: { "medications.$": item } }
                );
            }
            
            if (toAdd.length > 0) {
                const enriched = toAdd.map(op => ({ ...op, _id: new mongoose.Types.ObjectId() }));

                await medications.updateOne(
                    { uid },
                    { $push: { medications: { $each: enriched } } }
                );
            }

            await queue.deleteOne({patientID: uid})

            return res.json({ status: 'success' });
        } else { 
            // Create new medication document
            const enriched = formFields.map(op =>
                op._id ? op : { ...op, _id: new mongoose.Types.ObjectId() }
            );

            await medications.create({
                uid,
                medications: enriched
            });
            
            await queue.deleteOne({patientID: uid})

            return res.json({ status: 'success' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
