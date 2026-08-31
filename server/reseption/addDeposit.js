const express = require('express');
const router = express.Router();
const { billRequests } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const id = req.body.id
        const deposit = req.body.deposit
        const mode = req.body.mode

        await billRequests.updateOne(
            {_id: id}, 
            {
                $set: {
                    deposit: deposit,
                    mode: mode
                },
                $inc: {initialDeposit: + deposit},
            },
        )
        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;