const express = require('express');
const router = express.Router();
const { staff } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const staffs = await staff.find()

        return res.json({status:'success', staffs})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;