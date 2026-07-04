const express = require('express');
const router = express.Router();
const { util } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const dec = req.body.dec
        const id = req.body.id

        if(dec){
            await util.updateOne({_id: id},{
                $inc: {quantity: -1}
            })
        }else{
            await util.updateOne({_id: id},{
                $inc: {quantity: 1}
            })
        }

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;