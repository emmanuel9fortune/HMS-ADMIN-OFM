const express = require('express');
const router = express.Router();
const { subscribes } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const serveID = req.body.serveID
        await subscribes.deleteOne({_id: serveID})

        return res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;