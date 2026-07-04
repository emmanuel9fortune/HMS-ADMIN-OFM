const express = require('express');
const router = express.Router();
const { subscribes } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const subscribe = await subscribes.find().limit(20)

        return res.json({status:'success', diagnosis: subscribe})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;