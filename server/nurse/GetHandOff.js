const express = require('express');
const router = express.Router();
const { handoffs, staff, Patient } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const getHandOFf = await handoffs.findOne({tage:'nurse'})

        const staffs = await staff.findOne({_id: getHandOFf?.staffID})
        
        const getpatients = await Patient.find({status:'admitted'})
                
        return res.json({status:'success', getHandOFf, staffs, getpatients})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;