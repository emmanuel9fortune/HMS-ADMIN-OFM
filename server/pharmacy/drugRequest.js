const express = require('express');
const router = express.Router();
const { billRequests, staff, Patient, prescribes } = require('../../model');
// const BillRequest = require('../model/BillRequest');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const billId = null

        const patient = await Patient.findOne({_id: uid})

        // await BillRequest.updateOne(
        //     { _id: billId },

        //     {
        //         $set: {
        //             'workflow.currentDepartment': 'pharmacy',
        //             'workflow.nextDepartment': 'cashier',
        //             'workflow.stage': 'RETURNED_TO_CASHIER',

        //             'dates.dispensedAt': new Date(),

        //             'actors.dispensedBy': pharmacyStaffId
        //         }
        //     }
        // );

        const utils = await billRequests.find({uid, status: 'AWAITING', type:'doctor'})
        const prescribe = await prescribes.find({uid})
        
        const getStaffID = utils?.length > 0 ? utils?.map((item)=> item?.doctorID) : [] 

        const getStaffDetails = await staff.find({_id: {$in: getStaffID}})

        return res.json({status:'success', utils, getStaffDetails, patient, prescribe})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;