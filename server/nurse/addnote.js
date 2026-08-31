const express = require('express');
const router = express.Router();
const { note, staff } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            notes,
            uid
        } = req.body

        const getnote = await note.findOne({title: 'nurse'})
        const getSaff = await staff.findOne({_id: uid}).select('name title _id')

        if(getnote){
            await note.updateOne(
                { title: getSaff?.title },
                {$set: {notes}},
            );
        }else{
            await note.create({
                title: getSaff?.title,
                notes,
            });
        }

        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;