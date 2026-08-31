const express = require('express');
const router = express.Router();
const { medications } = require('../../model');

router.post('/', async(req, res) => {
    const uid = req.body.uid;
    const id = req.body.id;
   try {
        await medications.findOneAndUpdate(
            { uid }, // find the parent document by user id
            { $pull: { medications: { _id: id } } }, // remove the subdoc by its _id
            { new: true }
        )

        res.json({status:'success', message: 'Deleted Successfully'})
   } catch (error) {
    (error);
   }
});

module.exports = router;