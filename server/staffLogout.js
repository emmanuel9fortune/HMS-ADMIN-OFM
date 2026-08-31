const express = require('express');
const router = express.Router();
const { staff } = require('../model');
const mongoose = require('mongoose');

router.post('/', async(req, res) => {
    try {

        const staffID = req.body.staffID

        await staff.updateOne(
            {_id: new mongoose.Types.ObjectId(staffID)},
            {
                logoutTimeStamp: new Date().getTime(),
                status: 'Inactive'
            }
        )

        return res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;