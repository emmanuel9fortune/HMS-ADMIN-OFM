const express = require('express');
const router = express.Router();
const { util, Patient } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const uid = req.body.uid

        const getPatient = await Patient.findOne({_id: uid})
        const now = Date.now()

        const utils = await util.find({
            expireDate: {$gte: now},
            // type:'drugs'
        }).sort({expireDate: -1}).limit(10)

        return res.json({status:'success', utils, getPatient})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;