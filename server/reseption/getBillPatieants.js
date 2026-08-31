const express = require('express');
const router = express.Router();
const { billRequests, Patient, staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const getbills = await billRequests.find().limit(20)

        const getbillID = getbills?.length > 0 ? getbills.map((item)=> item.uid) : []
        const getstaffID = getbills?.length > 0 ? getbills.map((item)=> item.staffID) : []

        const getpatients = await Patient.find({_id: {$in: getbillID}})
        const getstaffs = await staff.find({_id: {$in: getstaffID}}).select('name title deposit status _id')
        
        return res.json({status:'success', getpatients, getbills, getstaffs})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});
 
module.exports = router;