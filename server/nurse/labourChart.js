const express = require('express');
const router = express.Router();
const { labours } = require('../../model');
const mongoose = require('mongoose');

router.post('/', async(req, res) => {
    try {

        const {
            uid,
        } = req.body

        const labour = await labours.findOne({uid: uid})
        
        res.json({status:'success', labour})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;