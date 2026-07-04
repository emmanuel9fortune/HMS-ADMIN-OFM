const express = require('express');
const router = express.Router();
const { diagnos } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const searchQuery = req.body.search?.trim()
        if (!searchQuery) {
            return res.status(400).json({ error: 'Search query cannot be empty' });
        }

        const patients = await diagnos.find({
            $or: [
                {
                    name: { $regex: searchQuery, $options: 'i' },
                }
            ]
        })
        .limit(10);

        res.json({status:'success', patients})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;