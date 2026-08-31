// getItems

const express = require('express');
const router = express.Router();
const { billRequests, staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const getpatientItems = await billRequests.find({uid, type:'nurse'})

        const getStaffID = getpatientItems?.length > 0 ? getpatientItems?.map((item)=> item?.nurseID)  : []

        const getStaff = await staff.find({_id: {$in: getStaffID}})
        
        return res.json({status:'success', getpatientItems, getStaff})
 
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;