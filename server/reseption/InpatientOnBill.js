// InpatientOnBill
const express = require('express');
const router = express.Router();
const { prescribes, Patient, staff, billRequests } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const getbills = await prescribes.find({tag:'cashier'})
        const getInpatiensbills = await billRequests.find({status:'APPROVE'})

        const getbillID = getbills?.length > 0 ? getbills.map((item)=> item.uid) : []
        const getbillID1 = getInpatiensbills?.length > 0 ? getInpatiensbills.map((item)=> item.uid) : []
        const getstaffID = getbills?.length > 0 ? getbills.map((item)=> item.doctorID) : []
        const getstaffID2 = getInpatiensbills?.length > 0 ? getInpatiensbills.map((item)=> item.nurseID) : []

        const combine1 = Array.from(new Set([...getbillID1, ...getbillID]))
        const combine2 = Array.from(new Set([...getstaffID2, ...getstaffID]))

        const getpatients = await Patient.find({_id: {$in: combine1}})
        const getstaffs = await staff.find({_id: {$in: combine2}}).select('name title deposit status _id')
        
        return res.json({status:'success', getpatients, getbills, getstaffs})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;