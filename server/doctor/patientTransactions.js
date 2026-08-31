// patientTransactions
const express = require('express');
const router = express.Router();
const { billRequests, Patient } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid    

        const bills = await billRequests.find({uid});

        const pendingBills = bills.filter(bill => bill.status === 'PENDING');
        const paidBlls = bills.filter(bill => bill.status === 'PAID');

        
        return res.json({status:'success', pendingBills, paidBlls})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;