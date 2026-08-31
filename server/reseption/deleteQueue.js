const express = require('express');
const router = express.Router();
const { queue } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        await queue.deleteOne({patientID: uid})

        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;