const express = require('express');
const router = express.Router();
const { billRequests, staff, prescribes } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const utils = await billRequests.find({uid, type:'doctor'})

        const prescribe = await prescribes.find({uid})

        const getStaff = prescribe?.length > 0 ? prescribe?.map((item)=> item?.uid) : []
        
        const getStaffID = utils?.length > 0 ? utils?.map((item)=> item?.doctorID) : []

        const combineID = [...new Set([...getStaff, ...getStaffID])]
 
        const getStaffDetails = await staff.find({_id: {$in: combineID}})

        return res.json({status:'success', utils, getStaffDetails, prescribe})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;