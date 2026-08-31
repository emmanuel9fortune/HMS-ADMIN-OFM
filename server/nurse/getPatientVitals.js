const express = require('express');
const router = express.Router();
const { vital } = require('../../model');
const mongoose = require('mongoose');

router.post('/', async(req, res) => {
    try {

        const {
            uid,
        } = req.body

        const vitals = await vital.findOne({uid: uid})
        
        res.json({status:'success', vitals})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;