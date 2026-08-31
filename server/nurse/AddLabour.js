// AddLabour

const express = require('express');
const router = express.Router();
const { labours, queue } = require('../../model');
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

        const existinglabours = await labours.findOne({ uid });

        if (existinglabours) {
            // Update existing labourss
            for (const item of toUpdate) {
                await labours.updateOne(
                    { uid, "labour._id": item._id },
                    { $set: { "labour.$": item } }
                );
            }

            // Add new labourss
            if (toAdd.length > 0) {
                const enriched = toAdd.map(op => ({ ...op, _id: new mongoose.Types.ObjectId() }));

                await labours.updateOne(
                    { uid },
                    { $push: { labour: { $each: enriched } } }
                );
            }
            await queue.deleteOne({patientID: uid})

            return res.json({ status: 'success' });
        } else { 
            // Create new labours document
            const enriched = formFields.map(op =>
                op._id ? op : { ...op, _id: new mongoose.Types.ObjectId() }
            );

            await labours.create({
                uid,
                labour: enriched
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
