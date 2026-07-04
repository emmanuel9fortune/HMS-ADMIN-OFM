const express = require('express');
const router = express.Router();
const { billRequests } = require('../../model');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const id = req.body.id

        await billRequests.deleteOne({_id:id, uid: uid})

        res.json({status:'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;