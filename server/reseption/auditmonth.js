const express = require('express');
const router = express.Router();
const { billRequests, Patient, staff, expenses } = require('../../model');

router.post('/', async (req, res) => {
  try {
    const { year, month, sorts, id } = req.body;
    if (!month || !year) return res.status(400).json({ status: 'error', message: 'Missing year or month' });

    const getstaff = await billRequests.find()
    const getstaffID =  getstaff?.length > 0 ? getstaff?.map((itm)=> itm?.staff) : []
    const staffs = await staff.find({_id: {$in: getstaffID}})
    
    const start = new Date(year, month - 1, 1).getTime();
    const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    if(id){
        const query = {
            timeStamp: { $gte: start, $lte: end },
            staff: id ,
        };

        if (sorts === 'lab') query.type = 'lab';
        else if (sorts === 'scan') query.type = 'scan';
        else if (sorts === 'utils') query.nurseID = { $exists: true };
        else if (sorts === 'drugs') query.doctorID = { $exists: true };

        const bills = await billRequests.find(query);
        
        const expense = await expenses.find(
            {
                time: { $gte: start, $lte: end },
                staff: id 
            }
        )
        const pharmBills = bills.filter(b => b.status === 'AWAITING');
        const pendingBills = bills.filter(b => b.status === 'PENDING' && b.services && b.timeStamp);
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
        const paidBills = bills.filter(b => b.status === 'PAID');

        const patientIds = bills.map(b => b.uid).filter(Boolean);
        const patients = await Patient.find({ _id: { $in: patientIds } });

        res.json({ staffs, status: 'success', pendingBills, paidBills, patients, expense, pharmBills, debtBills });

    }else{
        const query = {
          timeStamp: { $gte: start, $lte: end },
        };

        if (sorts === 'lab') query.type = 'lab';
        else if (sorts === 'scan') query.type = 'scan';
        else if (sorts === 'utils') query.nurseID = { $exists: true };
        else if (sorts === 'drugs') query.doctorID = { $exists: true };
    
        const bills = await billRequests.find(query);
        const pendingBills = bills.filter(b => b.status === 'PENDING' && b.services && b.timeStamp);
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
        const paidBills = bills.filter(b => b.status === 'PAID');
        const pharmBills = bills.filter(b => b.status === 'AWAITING');
    
        const patientIds = bills.map(b => b.uid).filter(Boolean);
        const patients = await Patient.find({ _id: { $in: patientIds } });
        
        const expense = await expenses.find(
            {
                time: { $gte: start, $lte: end },
            }
        )

        res.json({ staffs, status: 'success', pendingBills, paidBills, patients, expense, pharmBills, debtBills });

    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;