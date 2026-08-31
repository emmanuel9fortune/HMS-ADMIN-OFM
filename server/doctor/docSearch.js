const express = require('express');
const router = express.Router();
const { util } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const searchQuery = req.body.search?.trim()
        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query cannot be empty' });
        }

        const utils = await util.find({
            name: { $regex: searchQuery, $options: 'i' },
            type: 'drugs'
        })

        res.json({status:'success', utils})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;