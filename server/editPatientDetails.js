const express = require('express');
const router = express.Router();
const { Patient, antenatal } = require('../model');

router.post('/', async(req, res) => {
    try {

        const uid = req.body.uid
        const changes = req.body.changes

        if (!uid) {
            return res.status(400).json({ error: 'Search query cannot be empty' });
        }

        await Patient.updateOne(
            {_id: uid},
            {$set: changes}
        )

        await antenatal.updateOne(
            {uid},
            {$set: changes}
        )

        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;