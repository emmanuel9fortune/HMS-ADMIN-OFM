// deleteRoster

const express = require('express');
const router = express.Router();
const { rosters} = require('../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            Id,
        } = req.body

        await rosters.updateOne(
            { type: 'nurse' },
            {$pull: {roster: {_id: Id}}},
        );

        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;