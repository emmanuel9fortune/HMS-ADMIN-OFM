const express = require('express');
const router = express.Router();
const { Patient, queue } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const uid = req.body.uid
        const status = req.body.status

        const stats = status

        await Patient.updateOne(
            {_id: uid}, 
            {$set: {status: stats}}
        )

        await queue.deleteOne({patientID: uid})
        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("nurse").emit("message", `Patient ${getpatientName?.name} is now an ${status ? 'In Patient' : 'Out Patient'} !!`)
        
        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;