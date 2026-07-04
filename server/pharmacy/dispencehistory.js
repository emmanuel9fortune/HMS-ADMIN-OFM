const express = require('express');
const router = express.Router();
const { billRequests, Patient, staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const unix = req.body.unix
        const eunix = req.body.eunix        

        const bill1 = await billRequests.find(
            {
                timeStamp: {
                    $gte: unix,    
                    $lte: eunix 
                },
                nurseID: {$exists: true}
            }
        );

        const bill2 = await billRequests.find(
            {
                timeStamp: {
                    $gte: unix,    
                    $lte: eunix 
                },
                doctorID: {$exists: true},
            }
        );

        const bills = [...new Set([...bill1, ...bill2])]

        const pendingBills = bills.filter(bill => bill.status === 'PENDING');
        const paidBlls = bills.filter(bill => bill.status === 'PAID');

        const getPatientID = bills?.map((item)=>item?.uid)
        const getStaffID = bills?.map((item)=>item?.staffID)
        const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
        const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
        
        return res.json({status:'success', pendingBills, paidBlls, getPatients, getStaffs})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;