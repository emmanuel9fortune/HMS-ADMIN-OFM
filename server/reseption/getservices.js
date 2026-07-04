// getservices
const express = require('express');
const router = express.Router();
const { serve } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const services = await serve.find()

        return res.json({status:'success',  services})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;