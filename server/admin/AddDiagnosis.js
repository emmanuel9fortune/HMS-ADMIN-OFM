const express = require('express');
const router = express.Router();
const { diagnos } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const name = req.body.name
        const type = req.body.type

        await diagnos.create({
            name,
            type,
            timeStamp: new Date().getDate()
        }) 

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;