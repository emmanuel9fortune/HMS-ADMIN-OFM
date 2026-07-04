const express = require('express');
const router = express.Router();
const { queue, Patient } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const queued =  await queue.find().limit(10)

        const getID = queued?.length > 0 ? queued?.map((patient)=> patient?.patientID) : []

        const getpatients = await Patient.find({_id: {$in: getID}})

        res.json({status:'success', getpatients})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;