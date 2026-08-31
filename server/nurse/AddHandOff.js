const express = require('express');
const router = express.Router();
const { handoffs } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const staffID = req.body.staffID
        const note = req.body.note

        const getHandOFf = await handoffs.findOne({tage:'nurse'})

        if(getHandOFf){
            await handoffs.updateOne(
                {_id: getHandOFf?._id}, 
                {
                    $set: {
                        note: note,
                        staffID: staffID
                    },
                },
                
            )
        }else{
            await handoffs.create({
                note,
                staffID,
                tage: 'nurse'
            })        
        }
        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;