const express = require('express');
const router = express.Router();
const { Patient, antenatal, patientEdited, queue, notifications, billRequests, AnteNat } = require('../../model');
const { getIO } = require('../../socketManager');
const mongoose = require('mongoose');

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
            patientType,
            patientType1,
            members,
            family,
            subscribe,
            familyid
        } = req.body

        const getsub = await AnteNat.findOne({id: 'Admin'})

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
            family: family || false,
            familyid: familyid || '',
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
            staffID: staffID || '',
            subscribe: subscribe || '',
            AverageMonthlyFamilyIncome: AverageMonthlyFamilyIncome || '',
        };


        let hours = now.getHours();

        
        if(uid){
             await Patient.updateOne(
                {_id: uid},
                {$set: patientInfo}
            ) 

            if(patientType === 'new'){
                if(hours >= 18){
                    await billRequests.create({
                        uid: uid,
                        name,
                        staffID,
                        services: JSON.stringify({items:[{name: 'Evening Card', price:1500, quantity: 1, totalPrice: 1500}] , totalPrice: 1500}),
                        status: 'PENDING',
                        type: 'cashier',
                        timeStamp : new Date().getTime()
                    })
                }else{
                    await billRequests.create({
                        uid: uid,
                        name,
                        staffID,
                        services: JSON.stringify({items:[{name: 'Morning Card', price:500, quantity: 1, totalPrice: 500}] , totalPrice: 500}),
                        status: 'PENDING',
                        type: 'cashier',
                        timeStamp : new Date().getTime()
                    })
                }
            }

            res.json({status:'success'}) 
        }else{
            const user = await Patient.create(patientInfo);
            await antenatal?.create({uid: user?._id})

            const io = getIO()
            io.to("nurse").emit("message", `Patient ${name} Awaiting Vital Tests !`)

            
            if(patientType === 'new'){
                if(hours >= 18){
                    await billRequests.create({
                        uid: user?._id,
                        name,
                        staffID,
                        services: JSON.stringify({items:[{name: 'Evening Card', price:1500, quantity: 1, totalPrice: 1500}] , totalPrice: 1500}),
                        status: 'PENDING',
                        type: 'cashier',
                        timeStamp : new Date().getTime()
                    })
                }else{
                    await billRequests.create({
                        uid: user?._id,
                        name,
                        staffID,
                        services: JSON.stringify({items:[{name: 'Morning Card', price:500, quantity: 1, totalPrice: 500}] , totalPrice: 500}),
                        status: 'PENDING',
                        type: 'pharmacy',
                        timeStamp : new Date().getTime()
                    })
                }
            }

            if(subscribe === 'BASIC'){
                await billRequests.create({
                    uid: user?._id,
                    name,
                    staffID,
                    services: JSON.stringify({items:[{name: 'Antenatal Basic Card', price: getsub?.basic, quantity: 1, totalPrice: getsub?.basic}] , totalPrice: getsub?.basic}),
                    status: 'PENDING',
                    type: 'pharmacy',
                    timeStamp : new Date().getTime()
                })
            }else if(subscribe === 'SILVER'){
                await billRequests.create({
                    uid: user?._id,
                    name,
                    staffID,
                    services: JSON.stringify({items:[{name: 'Antenatal Silver Card', price: getsub?.silver, quantity: 1, totalPrice: getsub?.silver}] , totalPrice: getsub?.silver}),
                    status: 'PENDING',
                    type: 'pharmacy',
                    timeStamp : new Date().getTime()
                })
            }else if(subscribe === 'GOLD'){
                await billRequests.create({
                    uid: user?._id,
                    name,
                    staffID,
                    services: JSON.stringify({items:[{name: 'Antenatal Gold Card', price: getsub?.gold, quantity: 1, totalPrice: getsub?.gold}] , totalPrice: getsub?.gold}),
                    status: 'PENDING',
                    type: 'pharmacy',
                    timeStamp : new Date().getTime()
                })
            }

            if(family && patientType1 === 'new'){
                await billRequests.create({
                    uid: user?._id,
                    name,
                    staffID,
                    services: JSON.stringify({items:[{name: 'Family Card', price:5000, quantity: 1, totalPrice: 5000}] , totalPrice: 5000}),
                    status: 'PENDING',
                    type: 'pharmacy',
                    timeStamp : new Date().getTime()
                })
            } 
            
            
            if(!center){
 
                await queue.create({
                    patientID: user?._id,
                    timeStamp: new Date().getTime(),
                })

                const notify =  await notifications.findOne({uid: user?._id})
 
                if(notify){
                    await notifications.updateOne(
                        {uid: user?._id},
                        {$set: {
                            role: 'nurse',
                            type: 'New Patient',
                            message: `Patient Awaiting Vitals`,
                            timeStamp : new Date().getTime()
                        }}
                    )
                }else{
                    await notifications.create({
                        uid: user?._id,
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