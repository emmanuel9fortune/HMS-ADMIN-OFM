const express = require('express');
const router = express.Router();
const { billRequests, staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const utils = await billRequests.find({uid, status: 'AWAITING', nurseID: {$exists: true}})

        const getStaffID = utils?.length > 0 ? utils?.map((item)=> item?.nurseID || item?.doctorID || item?.staffID) : []

        const getStaffDetails = await staff.find({_id: {$in: getStaffID}})

        return res.json({status:'success', utils, getStaffDetails})
    } catch (error) { 
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;