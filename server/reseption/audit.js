const express = require('express');
const router = express.Router();
const { billRequests, Patient, staff, expenses } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const unix = req.body.unix
        const eunix = req.body.eunix        
        const sorts = req.body.sorts        
        const mode = req.body.mode        
        const id = req.body.staff    

        
        
        const getstaff = await billRequests.find()
        const getstaffID =  getstaff?.length > 0 ? getstaff?.map((itm)=> itm?.staff) : []
        const staffs = await staff.find({_id: {$in: getstaffID}})

        if(sorts === 'lab'){
            if(id){
                 const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        type: 'lab',
                        mode: mode || {$exists: true},
                        staff: id ,
                    }
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
            }else{
                 const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        type: 'lab',
                        mode: mode || {$exists: true},
                    }
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                 const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
            }
        }else if(sorts === 'scan'){
            if(id){
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        type: 'scan',
                        mode: mode || {$exists: true},
                        staff: id ,
                    }
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
            }else{
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        type: 'scan',
                        mode: mode || {$exists: true},
                    }
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
                }
        }else if(sorts === 'utils' || sorts === 'consumables'){
            if(id){
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        nurseID: {$exists: true},
                        mode: mode || {$exists: true},
                        staff: id ,
                    }
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
            }else{
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        nurseID: {$exists: true},
                        mode: mode || {$exists: true},
                    }
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
            }
        }else if(sorts === 'payout'){
            if(id){
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        name: {$exists: true},
                        uid: {$exists: false},
                        mode: mode || {$exists: true},
                        staffID: id ,
                    }
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
            }else{
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        name: {$exists: true},
                        uid: {$exists: false},
                        mode: mode || {$exists: true},
                    }
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
            }
        }else if(sorts === 'CHURCH'){
            if(id){
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        mode: 'CHURCH',
                        staff: id ,
                    }
                );

                const paidBlls = bills.filter(bill => bill.status === 'PAID' || bill.status === 'PENDING' || bill.status === 'AWAITING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const pendingBills = bills.filter(b => b.status === 'PENDING');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', paidBlls, getPatients, getStaffs, pharmBills, pendingBills, debtBills})
            }else{
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        mode: 'CHURCH',
                    }
                );

                const paidBlls = bills.filter(bill => bill.status === 'PAID' || bill.status === 'PENDING' || bill.status === 'AWAITING');
                const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const pendingBills = bills.filter(b => b.status === 'PENDING');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', paidBlls, getPatients, getStaffs, pharmBills, pendingBills, debtBills})
            }
        }else if(sorts === 'drugs' || sorts === 'consultation' || sorts === 'cards'){

            if(sorts === 'drugs'){
                if(id){
                    const bills = await billRequests.find(
                        {
                            timeStamp: {
                                $gte: unix,    
                                $lte: eunix 
                            },
                            doctorID: {$exists: true, $ne: null},
                            mode: mode || {$exists: true},
                            staff: id ,
                        } 
                    );

                    const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                    const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                    const paidBlls = bills.filter(bill => bill.status === 'PAID');

                    const getPatientID = bills?.map((item)=>item?.uid)
                    const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                    const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                    const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                    
                    return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
                }else{
                    const bills = await billRequests.find(
                        {
                            timeStamp: {
                                $gte: unix,    
                                $lte: eunix 
                            },
                            doctorID: {$exists: true, $ne: null},
                            mode: mode || {$exists: true},
                        } 
                    );

                    const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                    const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                    const paidBlls = bills.filter(bill => bill.status === 'PAID');

                    const getPatientID = bills?.map((item)=>item?.uid)
                    const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                    const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                    const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                    
                    return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
                }
            }else{
               if(id){
                    const bills = await billRequests.find(
                        {
                            timeStamp: {
                                $gte: unix,    
                                $lte: eunix 
                            },
                            type: {$in: ['doctor', 'pharmacy', 'cashier', 'consult', 'doc']},
                            mode: mode || {$exists: true},
                            uid: {$exists: true},
                            staff: id ,
                        } 
                    );

                    const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                    const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                    const paidBlls = bills.filter(bill => bill.status === 'PAID');

                    const getPatientID = bills?.map((item)=>item?.uid)
                    const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                    const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                    const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                    
                    return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
               }else{
                 const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        type: {$in: ['doctor', 'pharmacy', 'cashier', 'consult', 'doc']},
                        mode: mode || {$exists: true},
                        uid: {$exists: true}
                    } 
                );

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                    const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                const getStaffs = await staff.find({_id: {$in: getStaffID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, getStaffs, pharmBills, debtBills})
               }
            }

        }else {
            if(id){
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        mode: mode || {$exists: true},
                        staff: id,
                    }
                );

                const expense = await expenses.find(
                    {
                        time: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        staff: id ,
                    }
                )

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                    const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getStaffID2 = expense?.map((item)=>item?.staffID && item?.staffID)
                const combine = Array.from(new Set([...getStaffID, ...getStaffID2]));
                const getStaffs = await staff.find({_id: {$in: combine}}) 
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, staff: getStaffs, expense, pharmBills, debtBills})
            }else{
                const bills = await billRequests.find(
                    {
                        timeStamp: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                        mode: mode || {$exists: true},
                    }
                );

                const expense = await expenses.find(
                    {
                        time: {
                            $gte: unix,    
                            $lte: eunix 
                        },
                    }
                )

                const pendingBills = bills.filter(bill => bill.status === 'PENDING');
                    const pharmBills = bills.filter(b => b.status === 'AWAITING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
                const paidBlls = bills.filter(bill => bill.status === 'PAID');

                const getPatientID = bills?.map((item)=>item?.uid)
                const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
                const getStaffID2 = expense?.map((item)=>item?.staffID && item?.staffID)
                const combine = Array.from(new Set([...getStaffID, ...getStaffID2]));
                const getStaffs = await staff.find({_id: {$in: combine}}) 
                const getPatients = await Patient.find({_id: {$in: getPatientID}}) 
                
                return res.json({staffs, status:'success', pendingBills, paidBlls, getPatients, staff: getStaffs, expense, pharmBills, debtBills})
            }
        }

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});



router.post('/year', async (req, res) => {
  try {
    const { year, sorts, id, status } = req.body;
    if (!year) return res.status(400).json({ status: 'error', message: 'Missing year' });

    const getstaff = billRequests.find()
    const getstaffID =  getstaff?.length > 0 ? getstaff?.map((itm)=> itm?.staff) : []
    const staffs = await staff.find({_id: {$in: getstaffID}})
    // Year start and end timestamps
    if(id){
        const start = new Date(year, 0, 1).getTime();  // January 1, 00:00
        const end = new Date(year, 11, 31, 23, 59, 59, 999).getTime();  // December 31, 23:59:59

        // Build query
        const query = {
            timeStamp: { $gte: start, $lte: end },
            staff: id ,
            status: status || {$exists: true},
        };

        if (sorts === 'lab') query.type = 'lab';
        else if (sorts === 'scan') query.type = 'scan';
        else if (sorts === 'utils') query.nurseID = { $exists: true };
        else if (sorts === 'drugs') query.doctorID = { $exists: true };

        // Fetch bills and expenses
        const bills = await billRequests.find(query);
        const expense = await expenses.find({ time: { $gte: start, $lte: end }, staff: id , });

        // Split bills by status
        const pharmBills = bills.filter(b => b.status === 'AWAITING');
        const pendingBills = bills.filter(b => b.status === 'PENDING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
        const paidBills = bills.filter(b => b.status === 'PAID');

        // Resolve related patients and staffs
        const patientIds = bills.map(b => b.uid).filter(Boolean);
        const patients = await Patient.find({ _id: { $in: patientIds } });
        const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
        const getStaffID2 = expense?.map((item)=>item?.staffID && item?.staffID)
        const combine = Array.from(new Set([...getStaffID, ...getStaffID2]));
        const getStaffs = await staff.find({_id: {$in: combine}}) 

        res.json({ staffs, status: 'success', pendingBills, paidBills, patients, staffs: getStaffs, expense, pharmBills, debtBills });
    }else{
        const start = new Date(year, 0, 1).getTime();  // January 1, 00:00
        const end = new Date(year, 11, 31, 23, 59, 59, 999).getTime();  // December 31, 23:59:59

        // Build query
        const query = {
            timeStamp: { $gte: start, $lte: end },
            status: status || {$exists: true},
        };

        if (sorts === 'lab') query.type = 'lab';
        else if (sorts === 'scan') query.type = 'scan';
        else if (sorts === 'utils') query.nurseID = { $exists: true };
        else if (sorts === 'drugs') query.doctorID = { $exists: true };

        // Fetch bills and expenses
        const bills = await billRequests.find(query);
        const expense = await expenses.find({ time: { $gte: start, $lte: end }});

        // Split bills by status
        const pharmBills = bills.filter(b => b.status === 'AWAITING');
        const pendingBills = bills.filter(b => b.status === 'PENDING');
                const debtBills = bills.filter(bill => bill.status === 'DEBTORS');
        const paidBills = bills.filter(b => b.status === 'PAID');

        // Resolve related patients and staffs
        const patientIds = bills.map(b => b.uid).filter(Boolean);
        const patients = await Patient.find({ _id: { $in: patientIds } });
        const getStaffID = bills?.map((item)=>item?.staffID && item?.staffID)
        const getStaffID2 = expense?.map((item)=>item?.staffID && item?.staffID)
        const combine = Array.from(new Set([...getStaffID, ...getStaffID2]));
        const getStaffs = await staff.find({_id: {$in: combine}}) 

        res.json({ staffs, status: 'success', pendingBills, paidBills, patients, staffs: getStaffs, expense, pharmBills, debtBills });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


module.exports = router;