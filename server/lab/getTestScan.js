const express = require('express');
const router = express.Router();
const { serve } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const scan = await serve.find({type:'scan'})
        const lab = await serve.find({type:'test'})

        return res.json({status:'success', scan,  lab})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;