// DeleteBill

const express = require('express');
const router = express.Router();
const { billRequests } = require('../../model');

router.post('/', async(req, res) => {
    const id = req.body.id;
   try {
        await billRequests.deleteOne({ _id: id })

        res.json({status:'success', message: 'Deleted Successfully'})
   } catch (error) {
    (error);
   }
});

module.exports = router;