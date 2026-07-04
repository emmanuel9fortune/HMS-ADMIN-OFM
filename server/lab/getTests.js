// getTests
const express = require('express');
const router = express.Router();
const { billRequests } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const getTest = JSON.parse(req.body.getID)

        const getTests = await billRequests.find({approve:{$in: getTest}})
        res.json({status:'success', getTests})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router; 