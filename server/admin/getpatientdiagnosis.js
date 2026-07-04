const express = require('express');
const router = express.Router();
const { patientdiagnos } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const diagnos = await patientdiagnos.find({uid})

        return res.json({status:'success', diagnos})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;