const express = require('express');
const router = express.Router();
const { billRequests } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid

        const getpatientBills = await billRequests.find({uid, status:'DISAPPROVE'}).sort({timeStamp: -1}).limit(10)
        
        return res.json({status:'success', getpatientBills})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;