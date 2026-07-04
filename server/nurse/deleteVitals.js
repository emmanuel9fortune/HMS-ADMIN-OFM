
const express = require('express');
const router = express.Router();
const { vital } = require('../../model');

router.post('/', async(req, res) => {
    const uid = req.body.uid;
    const id = req.body.id;
   try {
        await vital.findOneAndUpdate(
            { uid }, // find the parent document by user id
            { $pull: { vitals: { _id: id } } }, // remove the subdoc by its _id
            { new: true }
        )

        res.json({status:'success', message: 'Deleted Successfully'})
   } catch (error) {
    (error);
   }
});

module.exports = router;