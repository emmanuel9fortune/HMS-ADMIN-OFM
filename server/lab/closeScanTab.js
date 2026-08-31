// closeScanTab
const express = require('express');
const router = express.Router();
const { request } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const { getTest } = req.body;

        await request.deleteMany({_id: {$in: getTest}})
        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;