const express = require('express');
const router = express.Router();
const { task } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            taskId,
        } = req.body


        await task.deleteOne({ _id: taskId});

        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;