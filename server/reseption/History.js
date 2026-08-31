const express = require('express');
const router = express.Router();
const { billRequests, Patient, staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const unix = req.body.unix
        const eunix = req.body.eunix        
        const sorts = req.body.sorts        

        if(sorts === 'lab'){
            const bills = await billRequests.find(
                {
                    timeStamp: {
                        $gte: unix,    
                        $lte: eunix 
                    },
                    type: 'lab'
                }
            );

            const pendingBills = bills.filter(bill => bill.status === 'PENDING');
            const paidBlls = bills.filter(bill => bill.status === 'PAID');

            const getPatientID = bills?.map((item)=>item?.uid)
            const getStaffID = bills?.map((item)=>item?.staffID)
            const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
            const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
            
            return res.json({status:'success', pendingBills, paidBlls, getPatients, getStaffs})
        }else if(sorts === 'scan'){
            const bills = await billRequests.find(
                {
                    timeStamp: {
                        $gte: unix,    
                        $lte: eunix 
                    },
                    type: 'scan'
                }
            );

            const pendingBills = bills.filter(bill => bill.status === 'PENDING');
            const paidBlls = bills.filter(bill => bill.status === 'PAID');

            const getPatientID = bills?.map((item)=>item?.uid)
            const getStaffID = bills?.map((item)=>item?.staffID)
            const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
            const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
            
            return res.json({status:'success', pendingBills, paidBlls, getPatients, getStaffs})
        }else if(sorts === 'utils'){
            const bills = await billRequests.find(
                {
                    timeStamp: {
                        $gte: unix,    
                        $lte: eunix 
                    },
                    nurseID: {$exists: true}
                }
            );

            const pendingBills = bills.filter(bill => bill.status === 'PENDING');
            const paidBlls = bills.filter(bill => bill.status === 'PAID');

            const getPatientID = bills?.map((item)=>item?.uid)
            const getStaffID = bills?.map((item)=>item?.staffID)
            const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
            const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
            
            return res.json({status:'success', pendingBills, paidBlls, getPatients, getStaffs})
        }else if(sorts === 'drugs'){
            const bills = await billRequests.find(
                {
                    timeStamp: {
                        $gte: unix,    
                        $lte: eunix 
                    },
                    doctorID: {$exists: true}
                } 
            );

            const pendingBills = bills.filter(bill => bill.status === 'PENDING');
            const paidBlls = bills.filter(bill => bill.status === 'PAID');

            const getPatientID = bills?.map((item)=>item?.uid)
            const getStaffID = bills?.map((item)=>item?.staffID)
            const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
            const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
            
            return res.json({status:'success', pendingBills, paidBlls, getPatients, getStaffs})
        }else{
            const bills = await billRequests.find(
                {
                    timeStamp: {
                        $gte: unix,    
                        $lte: eunix 
                    }
                }
            );

            const pendingBills = bills.filter(bill => bill.status === 'PENDING');
            const paidBlls = bills.filter(bill => bill.status === 'PAID');

            const getPatientID = bills?.map((item)=>item?.uid)
            const getStaffID = bills?.map((item)=>item?.staffID)
            const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
            const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
            
            return res.json({status:'success', pendingBills, paidBlls, getPatients, getStaffs})
        }

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

router.post('/month', async (req, res) => {
  try {
    const { year, month, sorts } = req.body;
    if (!month || !year) return res.status(400).json({ status: 'error', message: 'Missing year or month' });

    const start = new Date(year, month - 1, 1).getTime();
    const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    const query = {
      timeStamp: { $gte: start, $lte: end },
    };
    if (sorts === 'lab') query.type = 'lab';
    else if (sorts === 'scan') query.type = 'scan';
    else if (sorts === 'utils') query.nurseID = { $exists: true };
    else if (sorts === 'drugs') query.doctorID = { $exists: true };

    const bills = await billRequests.find(query);
    const pendingBills = bills.filter(b => b.status === 'PENDING');
    const paidBills = bills.filter(b => b.status === 'PAID');

    const patientIds = bills.map(b => b.uid).filter(Boolean);
    const staffIds = bills.map(b => b.staffID).filter(Boolean);
    const patients = await Patient.find({ _id: { $in: patientIds } });
    const staffs = await staff.find({ _id: { $in: staffIds } });

    res.json({ status: 'success', pendingBills, paidBills, patients, staffs });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;