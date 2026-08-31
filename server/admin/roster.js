const express = require('express');
const router = express.Router();
const { rosters } = require('../../model');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  try {
    const { formFields } = req.body;

    const existingroster = await rosters.findOne({ type: 'nurse' })

    if(existingroster){
        // Convert all _id to ObjectId and enrich if missing
        const enrichedFields = formFields.map(item => {
          let _id;
           try{
            _id = new mongoose.Types.ObjectId(item._id)
           }catch{
            _id = new mongoose.Types.ObjectId()
           }
           return {...item, _id}
        });

        // Get current operations _id from DB
        const roster = await rosters.findOne({ type: 'nurse' }, { roster: 1 });

        const existingIds = new Set(
          roster.roster.map(op => op._id.toString())
        );

        const toUpdate = enrichedFields.filter(item =>
          existingIds.has(item._id.toString())
        );

        const toAdd = enrichedFields.filter(item =>
          !existingIds.has(item._id.toString())
        );

        // Update existing
        for (const item of toUpdate) {
          await rosters.updateOne(
            { type: 'nurse', 'roster._id': item._id },
            { $set: { 'roster.$': item } }
          );
        }

        // Add new
        if (toAdd.length > 0) {
        await rosters.updateOne(
            { type:'nurse'},
            { $push: { roster: { $each: toAdd } } }
        );
        }
    }else{
      await rosters.create({
        type: 'nurse',
        roster: formFields 
      });
    }


    res.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;
