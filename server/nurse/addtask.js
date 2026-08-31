const express = require('express');
const router = express.Router();
const { task } = require('../../model');

router.post('/', async(req, res) => {
    try {

        const { 
            tasks,
            uid
        } = req.body

        await task.create({
            staffID: uid ,
            status : '',
            title : tasks?.title,
            timeStamp: new Date().getTime()
        });

        res.json({status: 'success'})
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;