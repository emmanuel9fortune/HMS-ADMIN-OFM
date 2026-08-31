const express = require('express');
const router = express.Router();
const { staff } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const staffID = req.body.staffID
        await staff.deleteOne({_id: staffID})

        return res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;