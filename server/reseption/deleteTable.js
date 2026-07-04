const express = require('express');
const router = express.Router();
const { Patient} = require('../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            opId,
            Id,
            uid
        } = req.body

        if(Id){
            await Patient.updateOne(
                { _id: uid },
                {$pull: {anteNatalRecords: {_id: Id}}},
            );
        }else{
            await Patient.updateOne(
                { _id: uid },
                {$pull: {operations: {_id: opId}}},
            );
        }

        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;