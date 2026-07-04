const express = require('express');
const router = express.Router();
const { expenses, staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const name = req.body.name
        const receiver = req.body.receiver
        const date = req.body.date
        const amount = req.body.amount
        const approve = req.body.approve
        const purpose = req.body.purpose
        const staffID = req.body.staffID
        const allowance = req.body.allowance
        const catalog = req.body.catalog
        const time = new Date().getTime()

        const getpatientBills = await expenses.create({
            date,
            name,
            receiver,
            amount,
            approve,
            purpose,
            staffID,
            allowance,
            catalog,
            time
        })
        
        return res.json({status:'success', getpatientBills})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

router.post('/getexpenses', async(req, res) => {
    try {
        const unix = req.body.unix
        const eunix = req.body.eunix 
        const id = req.body.staff 

        if(id){
            const expense = await expenses.find(
                {
                    time: {
                        $gte: unix,    
                        $lte: eunix 
                    },
                    staffID: id
                }
            )

            const getStaffs = await staff.find({title: {$in: ['cashier', 'receptionist']}})
            
            return res.json({status:'success', expense, getStaffs})
        }else{
            const expense = await expenses.find(
                {
                    time: {
                        $gte: unix,    
                        $lte: eunix 
                    },
                }
            )

            const getStaffs = await staff.find({title: {$in: ['cashier', 'receptionist']}})
            
            return res.json({status:'success', expense, getStaffs})
        }
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

router.post('/deleteexpense', async(req, res) => {
    try {
        const id = req.body.id

        await expenses.deleteOne({_id: id})
        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

router.post('/month', async (req, res) => {
  try {
    const { year, month, id } = req.body;
    if (!month || !year) return res.status(400).json({ status: 'error', message: 'Missing year or month' });

    const start = new Date(year, month - 1, 1).getTime();
    const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    if(id){
        const query = {
            time: { $gte: start, $lte: end },
            staffID: id
        };
    
        const bills = await expenses.find(query);
        const staffs = await staff.find({title: {$in: ['cashier', 'receptionist']}});
    
        res.json({ status: 'success', expense: bills, getStaffs: staffs });
    }else{
        const query = {
          time: { $gte: start, $lte: end },
        };
    
        const bills = await expenses.find(query);
        const staffs = await staff.find({title: {$in: ['cashier', 'receptionist']}});
    
        res.json({ status: 'success', expense: bills, getStaffs: staffs });
    }
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/catalog', async (req, res) => {
  try {
    const { year, month, id, catalog } = req.body;
    if (!catalog) return res.status(400).json({ status: 'error', message: 'Missing catalog' });

    const query = {
        catalog
    };

    if(year && month){
        const start = new Date(year, month - 1, 1).getTime();
        const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        query.time={
            $gte: start, 
            $lte: end
        };
    }

    if(id){
        query.staffID = id
    }

    
    const bills = await expenses.find(query);
    const staffs = await staff.find({title: {$in: ['cashier', 'receptionist']}});

    res.json({ status: 'success', expense: bills, getStaffs: staffs });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;