const express = require('express');
const router = express.Router();
const { billRequests } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const name = req.body.name
        const mode = req.body.mode
        const staffID = req.body.staffID
        const services = req.body.services

        await billRequests.create({
            name,
            staffID,
            services,
            mode,
            status: 'PAID',
            type: 'payout',
            timeStamp : new Date().getTime()
        }) 

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;