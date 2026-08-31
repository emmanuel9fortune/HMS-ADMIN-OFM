const express = require('express');
const router = express.Router();
const { subscribes } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const name = req.body.name
        const suscript = req.body.suscript
        const duration = req.body.duration

        await subscribes.create({
            name,
            duration,
            suscript,
            timeStamp: new Date().getDate()
        }) 

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;