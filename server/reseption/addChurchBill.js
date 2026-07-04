const express = require('express');
const router = express.Router();
const { churchBill, billRequests, Patient, request, notifications } = require('../../model');
const { getIO } = require('../../socketManager'); // ✅ ensure you have this export from your socket setup

router.post('/', async (req, res) => {
    try {
        const { amount, patient, uid, staff } = req.body;
        const timestamp = Date.now();
        const mode = 'CHURCH';

        const getPatient = await Patient.findOne({_id: uid})

        // 1. Create Church Bill
        await churchBill.create({
            amount,
            patient : patient || getPatient?.name ,
            timestamp
        });

        // 2. Fetch related bill requests
        const nurseLabScanRequests = await billRequests.find({ uid, type: { $in: ['nurse', 'lab', 'scan'] } });
        const doctorRequests = await billRequests.find({ uid, type: {$in: ['doctor', 'pharmacy', 'cashier', 'consult', 'doc']} });

        // 3. Update nurse/lab/scan requests
        if (nurseLabScanRequests.length > 0) {
            for (const reqItem of nurseLabScanRequests) {
                await request.updateOne(
                    { _id: reqItem._id },
                    { $set: { status: 'AWAITING' } }
                );
            }
        }

        // 4. Update doctor requests
        if (doctorRequests.length > 0) {
            for (const docReq of doctorRequests) {
                if (docReq.instruction) {
                    await billRequests.updateOne(
                        { _id: docReq._id },
                        { $set: { status: 'AWAITING', mode, timestamp: Date.now(), tag: 'PAID', staff } }
                    );
                } else {
                    await billRequests.updateOne(
                        { _id: docReq._id },
                        { $set: { status: 'PAID', mode, timestamp: Date.now(), tag: 'PAID', staff } }
                    );
                }
            }
        }

                // 3. Update nurse/lab/scan requests
        if (nurseLabScanRequests.length > 0) {
            for (const reqItem of nurseLabScanRequests) {
                if (reqItem.type === 'lab' || reqItem.type === 'scan') {
                    await billRequests.updateOne(
                        { _id: reqItem._id },
                        { 
                            $set: { 
                                status: 'AWAITING', 
                                mode, 
                                timestamp: Date.now(), 
                                tag: 'PAID',
                                staff
                            } 
                        }
                    );
                } else if (reqItem.type === 'nurse') {
                    await billRequests.updateOne(
                        { _id: reqItem._id },
                        { 
                            $set: { 
                                status: 'AWAITING', 
                                mode, 
                                timestamp: Date.now(),
                                staff
                            } 
                        }
                    );
                }
            }
        }


        // 5. Emit socket events
        const patientData = await Patient.findById(uid);
        const io = getIO();

        doctorRequests.forEach(() => {
            io.to("pharmacy").emit("message", `Patient ${patientData?.name} Prescription Sent !!`);
        });

        nurseLabScanRequests.forEach(reqItem => {
            if (reqItem.type === 'nurse') {
                io.to("pharmacy").emit("message", `Patient ${patientData?.name} Consumables Approved !!`);
            }
            if (reqItem.type === 'lab' || reqItem.type === 'scan') {
                io.to("laboratory").emit("message", `Patient ${patientData?.name} Bill Sent !!`);
            }
        });

        // 6. Notifications for doctor prescriptions
        for (const docReq of doctorRequests) {
            if (docReq.instruction) {
                const notify = await notifications.findOne({ uid });

                const notificationData = {
                    uid,
                    role: 'pharmacy',
                    type: 'New Requests',
                    message: `Prescriptions for ${patientData?.name}`,
                    timestamp: Date.now(),
                    tag: 'PAID'
                };

                if (notify) {
                    await notifications.updateOne({ uid }, { $set: notificationData });
                } else {
                    await notifications.create(notificationData);
                }
            }
        }

        return res.json({ status: 'success' });

    } catch (error) {
        console.error(error);
        res.json({ status: 'error', message: error.message });
    }
});

module.exports = router;
