const express = require('express');
const router = express.Router();
const { util, AnteNat } = require('../../model');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/', async(req, res) => {
    try {
        const basic = req.body.basic
        const silver = req.body.silver
        const gold = req.body.gold

        const getsub = await AnteNat.findOne({id: 'Admin'})

        if(!getsub){
            await AnteNat.create({
                basic,
                silver,
                gold,
                id: 'Admin'
            })
        }else{
            await AnteNat.updateOne(
                {id: 'Admin'},
                {$set : {
                    basic,
                    silver,
                    gold
                }}
            )
        }
            
        res.json({ status: 'success' });
        
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});


router.post('/get', async(req, res) => {
    try {

        const getsub = await AnteNat.findOne({id: 'Admin'})
            
        res.json({ status: 'success', getsub });
        
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;