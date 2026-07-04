// updatechurchbill.

const express = require('express');
const { churchBill } = require('../../model');
const router = express.Router();

router.post('/', async(req, res) => {
    try {

        const id = req.body.id;
        const status = req.body.status;

        const patients = await churchBill.updateOne({_id: id}, {$set:{status}})

        res.json({status:'success', patients})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;