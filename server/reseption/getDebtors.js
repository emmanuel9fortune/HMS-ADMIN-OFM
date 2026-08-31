// getDebtors
const express = require('express');
const router = express.Router();
const { billRequests } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const getpatientBills = await billRequests.find({uid, status:'DEBTORS'})
        
        return res.json({status:'success', getpatientBills})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;