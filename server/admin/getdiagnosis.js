const express = require('express');
const router = express.Router();
const { diagnos } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const diagnosis = await diagnos.find().limit(20)

        return res.json({status:'success', diagnosis})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;