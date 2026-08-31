const express = require('express');
const router = express.Router();
const { Patient, scanupload, scans, billRequests } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', scanupload.fields([
    { name: 'img', maxCount: 6 }  
]), async(req, res) => {
    try {

        const value = JSON.parse(req.body.value)
        
        const imageFiles = req.files['img'];
        const imageFilenames = imageFiles.map(file => file.filename);
        
        const existingLab = await scans.findOne({ uid: value?.uid?.id});

        

        const scanDetails ={
            photo1: imageFilenames[0] || null,
            photo2: imageFilenames[1] || null,
            photo3: imageFilenames[2] || null,
            photo4: imageFilenames[3] || null,
            photo5: imageFilenames[4] || null,
            photo6: imageFilenames[5] || null,
            testname: value?.testname,
            request: value?.request,
            scanID: value?.staffID,
            results: value?.results,
            doctorID: value?.docID,
            oid: value?.oid,
            timeStamp: new Date().getTime()
        }
        
        if(existingLab){
            await scans.updateOne(
                { uid: value?.uid?.id },
                { 
                    $push: { scan: scanDetails },
                }  
            );
        }else{
            await scans.create({
                uid: value?.uid?.id,
                scan: scanDetails 
            });
        }
        
        const getpatientName = await  Patient.findOne({_id: value?.uid?.id})
        const io = getIO()
        io.to("doctor").emit("message", `Patient ${getpatientName?.name} Scan Complete !!`)

        if(getpatientName.status !== 'admitted' && getpatientName.status !== 'emergency'){
            await Patient.updateOne(
                {_id:value?.uid?.id},
                {$set: {status: 'doctor'}}
            )
            
            return res.json({ status: 'success' });
        }else{

            return res.json({status: 'success'})
        }
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;