// discontinue

const express = require('express');
const router = express.Router();
const { prescribes, util, Patient } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const mainId = req.body.mainId
        const id = req.body.id
        const uid = req.body.uid

        const getPrescription = await prescribes.findOne(
            {uid, _id: mainId },
            {prescribe: {$elemMatch: {_id: id}}}
        )

        const now = Date.now()

        const elapsed = now - Number(getPrescription?.prescribe[0]?.timeStamp)

        if(!getPrescription?.prescribe[0]?.timeStamp || !getPrescription?.prescribe[0]?.time || !getPrescription?.prescribe[0]?.dosage){
            return res.json({status:'Error1', value: getPrescription})
        }

        let intervalHour;
        switch(getPrescription?.prescribe[0]?.time){
            case "4hr": 
                intervalHour = 4;
                break;
            case "6hr": 
                intervalHour = 6;
                break;
            case "12hr": 
                intervalHour = 12;
                break;
            case "24hr": 
                intervalHour = 24;
                break;
            case "48hr": 
                intervalHour = 48;
                break;
            default:
                return res.json({status:'Error2'})
        }

        const intervalMs = intervalHour * 60 * 60 * 1000

        const timesTaken = Math.floor(elapsed / intervalMs)

        const totalDosage = timesTaken * getPrescription?.prescribe[0]?.dosage

        const upadatedQuantity = getPrescription?.prescribe[0]?.quantity - totalDosage
        
        await prescribes.updateOne(
            { uid, _id: mainId, "prescribe._id": id },
            { $set: { "prescribe.$.status": 'discontinue', "prescribe.$.quantity": totalDosage   } },
        );
        
        await util.updateOne(
            {name: getPrescription?.prescribe[0]?.drugs},
            {$inc: {quantity: upadatedQuantity} }
        )

        const getpatientName = await  Patient.findOne({_id:uid})
        const io = getIO()
        io.to("pharmacy").emit("message", `Patient ${getpatientName?.name} Drug discontinued!!`)
        io.to("nurse").emit("message", `Patient ${getpatientName?.name} Drug discontinued!!`)

        return res.json({status:'success'})

    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;