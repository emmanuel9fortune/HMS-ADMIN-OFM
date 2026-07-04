const express = require('express');
const router = express.Router();
const { serve, patientdiagnos } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const name = req.body.name
        const type = req.body.type
        const uid = req.body.uid
        const staffID = req.body.staffID

        await patientdiagnos.create({
            name,
            uid,
            type,
            timeStamp: new Date().getTime(),
            staffID
        })

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;