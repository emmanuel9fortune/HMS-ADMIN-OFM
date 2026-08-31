// getInpatientRequest
const express = require('express');
const router = express.Router();
const { prescribes, billRequests } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const getpatientBills = await prescribes.find({uid, tag:'cashier'})
        const getconsumableBills = await billRequests.find({uid, status:'APPROVE'}) 
        
        return res.json({status:'success', getpatientBills, getconsumableBills})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;