const express = require('express');
const router = express.Router();
const { serve } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const name = req.body.name
        const type = req.body.type
        const price = req.body.price

        await serve.create({
            name,
            type,
            price
        })

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;