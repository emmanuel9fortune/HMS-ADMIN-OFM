const express = require('express');
const router = express.Router();
const { labs, notifications, Patient, request } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async (req, res) => {
  try {
    const { content, uid, getTest, oid } = req.body;

    if (!content || !uid) {
      return res.json({ status: 'error', message: 'Invalid input' });
    }
    
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = String(today.getFullYear())

    const fulldate = `${day}|${month}|${year}`


    const existingLab = await labs.findOne({ uid, date: fulldate });

    const contentArry={
      content,
      oid,
      timeStamp: new Date().getTime()
    } 
    
    if (existingLab) {
      await labs.updateOne(
        { uid, date: fulldate  },
        { 
          $push: { lab: contentArry },
        }  
      );
    } else {
      await labs.create({
        uid,
        date: fulldate,
        lab: contentArry 
      });
    }

    await request.deleteMany({_id: {$in: getTest}})

    const getpatientName = await  Patient.findOne({_id:uid})
    const io = getIO()
    io.to("doctor").emit("message", `Patient ${getpatientName?.name} Lab Tests Complete !!`)

    const notify =  await notifications.findOne({uid}) 

    if(notify){
      await notifications.updateOne(
        {uid: uid},
        {$set: {
            role: 'doctor',
            type: 'Test Results',
            message: `Patient Test Results are ready`,
            timeStamp : new Date().getTime()
        }}
      )
    }else{
      await notifications.create({
        uid: uid,
        role: 'doctor',
        type: 'Test Results',
        message: `Patient Test Results are ready`,
        timeStamp : new Date().getTime()
      })
    }

    if(getpatientName.status !== 'admitted' && getpatientName.status !== 'emergency'){
        await Patient.updateOne(
            {_id:uid},
            {$set: {status: 'doctor'}}
        )
        
      return res.json({ status: 'success' });
    }else{
      return res.json({ status: 'success' });
    }

  } catch (error) {
    console.error('RunTest Error:', error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;
