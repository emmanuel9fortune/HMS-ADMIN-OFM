const express = require('express');
const router = express.Router();
const { billRequests, staff, Patient, prescribes } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const patient = await Patient.findOne({_id: uid})

        const utils = await billRequests.find({uid, status: 'AWAITING', type:'doctor'})
        const prescribe = await prescribes.find({uid})
        
        const getStaffID = utils?.length > 0 ? utils?.map((item)=> item?.doctorID) : [] 

        const getStaffDetails = await staff.find({_id: {$in: getStaffID}})

        return res.json({status:'success', utils, getStaffDetails, patient, prescribe})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;