const express = require('express');
const router = express.Router();
const { Patient, queue, notifications } = require('../../model');
const { getIO } = require('../../socketManager');

router.post('/', async(req, res) => {
    try {
        const { 
            name, 
            religion, 
            address, 
            dateOfBirth, 
            AgeType, 
            sex, 
            notes, 
            nextOfKin, 
            age,
            phone,
            nextOfKinPhone,
            email,
            staffId,
            status,
            hop,
            center, 
            specialPoints, 
            sect, 
            tribe, 
            spousePhone, 
            nextOfKinAddress,  
            dateOfBooking, 
            occupation,
            educationLevel,
            maritalStatus,
            ageAtMarriage,
            LMP,
            eddByUss,
            eddDate,
            AverageMonthlyFamilyIncome, 
            uid,
            staffID,
            familyid,
            members,
            family,
            subscribe
        } = req.body

        const getCount = await Patient.find()

        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1

        const getHOP = `${getCount?.length + 1}-${month}-${year}`

        const patientInfo = {
            name: name || '',
            dateOfBirth: dateOfBirth || '',
            AgeType: AgeType || '',
            sex: sex || '',
            notes: notes || '',
            nextOfKin: nextOfKin || '',
            members: members || '',
            family: family || '',
            address: address || '',
            religion: religion || '',
            age: age || '',
            phone: phone || '',
            nextOfKinPhone: nextOfKinPhone || '',
            email: email || '',
            staffId: staffId || '',
            status: status || '',
            hop: getHOP || '',
            timeStamp: new Date().getTime(),
            admittedTime: new Date().getTime(),
            center: center || '',
            tribe: tribe || '',
            spousePhone: spousePhone || '',
            nextOfKinAddress: nextOfKinAddress || '',
            dateOfBooking: dateOfBooking || '',
            sect: sect || '',
            specialPoints: specialPoints || '',
            occupation: occupation || '',
            educationLevel: educationLevel || '',
            maritalStatus: maritalStatus || '',
            ageAtMarriage: ageAtMarriage || '',
            LMP: LMP || '',
            eddByUss: eddByUss || '',
            status: 'nurse',
            eddDate: eddDate || '',
            familyid: familyid || '',
            staffID: staffID || '',
            subscribe: subscribe || '',
            AverageMonthlyFamilyIncome: AverageMonthlyFamilyIncome || '',
        };


        
        if(uid){
             await Patient.updateOne(
                {_id: uid},
                {$set: patientInfo}
            ) 
            
            if(!center){
 
                await queue.create({
                    patientID: familyid,
                    timeStamp: new Date().getTime(),
                })

                const notify =  await notifications.findOne({uid: familyid})

                if(notify){
                    await notifications.updateOne(
                        {uid: familyid},
                        {$set: {
                            role: 'nurse',
                            type: 'New Patient',
                            message: `Patient Awaiting Vitals`,
                            timeStamp : new Date().getTime()
                        }}
                    )
                }else{
                    await notifications.create({
                        uid: familyid,
                        role: 'nurse',
                        type: 'New Patient',
                        message: `Patient Awaiting Vitals`,
                        timeStamp : new Date().getTime()
                    })
                }
                
            }

            res.json({status:'success', user})
        }
        
    } catch (error) {
        res.json({status:'error', message: error.message})
    }
});

module.exports = router;