const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Dispensing } = require('../../model');
require('dotenv').config();


router.post('/', async(req, res) => {
    try {

        const records = await Dispensing.find()
            .populate('staffId', 'name title')
            .populate('patientId', 'name')
            .sort({ dispensedAt: -1 });

        res.json({
            status: 'success',
            records
        });
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;