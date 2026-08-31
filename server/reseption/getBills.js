const express = require('express');
const router = express.Router();
const { billRequests, staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const getpatientBills = await billRequests.find({uid, status:'PENDING'})

        const getID = getpatientBills?.map((item)=> item?.nurseID || item?.doctorID || item?.staffID)

        const getstaffs = await staff.find({_id: {$in: getID}})
        
        return res.json({status:'success', getpatientBills, getstaffs})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;