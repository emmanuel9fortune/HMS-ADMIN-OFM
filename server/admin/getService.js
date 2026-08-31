const express = require('express');
const router = express.Router();
const { serve, billRequests } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const services = await serve.find().limit(20)

        const scan = await billRequests.countDocuments({type: 'scan'})

        const lab = await billRequests.countDocuments({type: 'lab'})

        return res.json({status:'success', services, scan,  lab})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;