// AddBabyVitals

const express = require('express');
const router = express.Router();
const { babyschem, queue } = require('../../model');
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

        const existinglabours = await babyschem.findOne({ uid });

        if (existinglabours) {
            // Update existing labourss
            for (const item of toUpdate) {
                await babyschem.updateOne(
                    { uid, "baby._id": item._id },
                    { $set: { "baby.$": item } }
                );
            }

            // Add new labourss
            if (toAdd.length > 0) {
                const enriched = toAdd.map(op => ({ ...op, _id: new mongoose.Types.ObjectId() }));

                await babyschem.updateOne(
                    { uid },
                    { $push: { baby: { $each: enriched } } }
                );
            }
            await queue.deleteOne({patientID: uid})

            return res.json({ status: 'success' });
        } else { 
            // Create new labours document
            const enriched = formFields.map(op =>
                op._id ? op : { ...op, _id: new mongoose.Types.ObjectId() }
            );

            await babyschem.create({
                uid,
                baby: enriched
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
