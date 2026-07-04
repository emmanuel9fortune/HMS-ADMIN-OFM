const express = require('express');
const router = express.Router();
const { Patient } = require('../../../model');

router.post('/', async(req, res) => {
    try {

        const {uid} = req.body

        await Patient.findOne({uid});
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;