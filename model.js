
const { timeStamp } = require('console');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const os = require('os')

const operationsSchema = new mongoose.Schema({
    eventType: String,
    uid: String,
    dateOfBirth: String,
    durationOfPregnancy: String,
    birthWeight: String,
    complicationInPregnancy: String,
    complicationIInLabour: String,
    puerPremium: String,
    ageAtDeath: String,
    causeOfDeath: String,
});

const recordSchema = new mongoose.Schema({
    heightOfFundus: String,
    uid: String,
    presentingPartToBrim: String,
    presentationAndPosition: String,
    oedema: String,
    foetalHeart: String,
    urine: String,
    BP: String,
    weight: String,
    HB: String,
    remark: String,
    initialOfExaminer: String,
    Return: String,
    date: String,
});

const patientSchema = new mongoose.Schema({
    name: String,
    address: String,
    notes: String,
    religion: String,
    hop: String,
    dateOfBirth: String,
    sex: String,
    nextOfKin: String,
    deposit: Number,
    age: String,
    uid: String,
    phone: Number,
    discount: Number,
    nextOfKinPhone: Number,
    email: String,
    password: String,
    otpTimestamp: String,
    otp: Number,
    emailVerified: Boolean,
    timeStamp: String,
    staffId: String,
    status: String,
    staff: String,
    members: Number,
    family: Boolean,
    familyid: String,
    subscribe: String,
    admittedTime: String,
    center: String,
    specialPoints: String,
    sect: String,
    tribe: String,
    spousePhone: String,
    nextOfKinAddress: String,
    dateOfBooking: String,
    occupation: String,
    educationLevel: String,
    maritalStatus: String,
    ageAtMarriage: String,
    LMP: String,
    eddByUss: String,
    eddDate: String, /////////////////////
    AverageMonthlyFamilyIncome: String,
    heartDisease: String,
    kidneyDisease: String,
    Diabetes: String,
    ChestDisease: String,
    Covid: String,
    PreviousePregnancies: String,
    NoOfLivingChildren: String,
    NumberOfOperations: String,
    AgeType: String,
    operations: [operationsSchema],
    anteNatalRecords: [recordSchema],
});

const AnteNatalSchema = new mongoose.Schema({
    uid: String,
    letter: String,
    specialInvestigation: String,  /////////////////////
    urinarySymptoms: String,
    historyPreg: String,
    vomiting: String,
    vaginalDischarge: String,
    swellingOfAnkles: String,
    bleeding: String,
    otherSymptoms: String,
    generalCondition: String,
    oedema: String,
    anaemia: String,
    respiratorySystem: String,
    cardiovascularSystem: String,
    abdomen: String,
    spleen: String,
    liver: String,
    preliminary: String,
    height: String, /////////////////////
    weight: String,
    feet:String,
    inches:String,
    ST:String,
    LBS:String,
    BP: String,
    albumin: String,
    sugar: String,
    breastNipples: String,
    HB: String,
    RH: String,
    genotype: String,
    USS: String,
    bloodGroup: String,
    chestXray: String,
    examiner: String,
    comments: String,
    pelvicAssessment: String,
    specialInstruction: String,
});



/////////////////////////////////////////////
/////////////////////////////////////////////

/////////////////////////////////////////////
/////////////////////////////////////////////

/////////////////////////////////////////////
/////////////////////////////////////////////
const serviceSchema = new mongoose.Schema({
    type: String,
    uid: String,
    result: String,
    amount: Number,
    status : String,
    timeStamp: String,
    staff: String
});

const serviceHistory = new mongoose.Schema({
    uid : String,
    services : [serviceSchema]
})

/////////////////////////////////////////////
/////////////////////////////////////////////
const paymentSchema = new mongoose.Schema({
    type: String,
    uid: String,
    result: String,
    amount: Number,
    status : String,
    timeStamp: String,
    staff: String
});

const paymentHistory = new mongoose.Schema({
    uid : String,
    payments : [paymentSchema]
})


////////////////////////////////////////////
////////////////////////////////////////////
const staffs = new mongoose.Schema({
    name : String,
    passkey : String,
    title : String,
    activity : String,
    status : String,
    loginTimeStamp : String,
    logoutTimeStamp : String,
    dob : String,
    address : String,
    phone : String,
    nextOfKin : String,
    nextOfKinPhone : String,
    email : String,
    state : String,
    lga : String,
    nationality : String,
    qualifications : String,
    referees : String,
})

const utils = new mongoose.Schema({
    name : String,
    quantity : Number,
    originalQuantity : Number,
    date : String,
    expireDate : String,
    batch : String,
    type : String,
    class : String,
    slag : String,
    originalPrice : Number,
    sellingPrice : Number,
    limit : Number,
    explimit : Number,
})

const expense = new mongoose.Schema({
    name : String,
    receiver : String,
    date : String,
    amount : Number,
    approve : Number,
    purpose : String,
    staffID : String,
    allowance : String,
    catalog : String,
    time : String,
})

const services = new mongoose.Schema({
    name : String,
    type : String,
    price : Number,
})

const diagnosis = new mongoose.Schema({
    name : String,
    type : String,
    timeStamp : Number,
})

const patientdiagnoses = new mongoose.Schema({
    name : String,
    uid : String,
    type : String,
    staffID : String,
    timeStamp : Number,
})

const patientEditSchema = new mongoose.Schema({
    staffID : String,
    type : String,
    timeStamp : String,
})

const patientEdit = new mongoose.Schema({
    uid : String,
    edited : [patientEditSchema]
})



////////////////////////////////////////////
////////////////////////////////////////////
const registerArray = new mongoose.Schema({
    name : String,
    timeStamp : String,
})

const registers = new mongoose.Schema({
    dailyTimestamp : String,
    register : [registerArray]
})
////////////////////////////////////////////
////////////////////////////////////////////

const queues = new mongoose.Schema({
    date : String,
    patientID : String,
    timeStamp : String,
})

const notification = new mongoose.Schema({
    role : String,
    type : String,
    message : String,
    uid: String,
    timeStamp: String,
    tag: String,
})

const vitalsArray = new mongoose.Schema({
    date : String,
    BP : String,
    pulse: Number,
    temperature: Number,
    height: Number,
    weight: Number,
    BMI: Number,
    spo: Number,
    oxygen: Number,
    repiratory: Number,
    RBS: Number,
    staffID: String,
})

const vitals = new mongoose.Schema({
    uid : String,
    vitals : [vitalsArray]
})

const urineArray = new mongoose.Schema({
    date : String,
    input : String,
    output: String,
    sign: String,
    remark: String,
})

const urine = new mongoose.Schema({
    uid : String,
    urine : [urineArray]
})

const labourArray = new mongoose.Schema({
    date : String,
    BP : String,
    RR: Number,
    temperature: Number,
    contraction: Number,
    intensity: Number,
    FHR: Number,
    PR: Number,
    VE: Number,
    staffID: String,
})

const labour = new mongoose.Schema({
    uid : String,
    labour : [labourArray]
})

const babyArray = new mongoose.Schema({
    date : String,
    pulse: Number,
    repiratory: Number,
    temperature: Number,
    height: Number,
    weight: Number,
    BMI: Number,
    spo: Number,
    oxygen: Number,
    RBS: Number,
    HC: Number,
    staffID: String,
})

const baby = new mongoose.Schema({
    uid : String,
    baby : [babyArray]
})

const tasks = new mongoose.Schema({
    staffID : String,
    status : String,
    title : String,
    timeStamp : String,
})

const labArray = new mongoose.Schema({
    content : String,
    timeStamp : String,
    oid : String,
})

const lab = new mongoose.Schema({
    uid : String,
    date : String,
    lab : [labArray]
})

const scanArray = new mongoose.Schema({
    request : String,
    results : String,
    doctorID : String,
    scanID : String,
    photo1 : String,
    photo2 : String,
    photo3 : String,
    photo4 : String,
    photo5 : String,
    photo6 : String,
    testname : String,
    timeStamp : String,
    oid : String,
})

const scan = new mongoose.Schema({
    uid : String,
    scan : [scanArray]
})

const notes = new mongoose.Schema({
    notes : String,
    staffID: String,
    title: String
})

const requests = new mongoose.Schema({
    uid : String,
    staffID: String,
    requests : String,
    timeStamp : String,
    type : String,
    status: String,
    oid: String
})

const rosterArray = new mongoose.Schema({
    time : String,
    mon : String,
    tue : String,
    wed: String,
    thu : String,
    fri : String,
    sat : String,
    sun : String,
})

const roster = new mongoose.Schema({
    type : String,
    roster : [rosterArray]
})

const medicationSchemaArray = new mongoose.Schema({
    timeStamp : String,
    medication : String,
    dosage : String,
    route: String,
    oxygen: String,
    staffID : String,
    remark : String,
})

const medication = new mongoose.Schema({
    uid : String,
    medications : [medicationSchemaArray]
})

const bills = new mongoose.Schema({
    uid : String,
    cashierID: String,
    services: String,
    timeStamp : String
})

const instructionArray = new mongoose.Schema({
    timeStamp : String,
    instruction: String,
})

const billRequest = new mongoose.Schema({
    uid : String,
    staffID: String,
    name: String,
    nurseID: String,
    doctorID: String,
    services: String,
    status: String,
    timeStamp : String,
    type : String,
    instruction : String,
    mode : String,
    deposit : Number,
    initialDeposit : Number,
    depositBy : String,
    preTime : String,
    tagged : String,
    tag : String,
    approve : String,
    receipt : String,
    id : String,
    oid : String,
    staff : String,
})

const prescribeArray = new mongoose.Schema({
    drugs : String,
    quantity : Number,
    price : Number,
    days : Number,
    daysOn : Number,
    dosage : Number,
    time : String,
    status : String,
    timeStamp : String,
    id : String,
})

const prescribe = new mongoose.Schema({
    uid : String,
    instruction : String,
    doctorID: String,
    timeStamp : String,
    status : String,
    tag: String,
    flag: String,
    oid: String,
    instruction :  [instructionArray],
    prescribe : [prescribeArray]
})

const handoff = new mongoose.Schema({
    staffID: String,
    note: String,
    tage: String
})

const church = new mongoose.Schema({
    amount: String,
    patient: String,
    timestamp: String,
    status: String,
})

const subscribe = new mongoose.Schema({
    name: String,
    amount: Number,
    duration: String,
    suscript: String,
    timestamp: String,
})

const clinicalnoteArray = new mongoose.Schema({
    date : String,
    note: String,
    staffID: String,
})

const AnteNatSub = new mongoose.Schema({
    basic : Number,
    gold: Number,
    silver: Number,
    id: String
})

const clinicalnote = new mongoose.Schema({
    uid : String,
    clinicalnote : [clinicalnoteArray]
})


// Models (corrected to avoid overwriting)
const Patient = mongoose.models.Patients || mongoose.model('Patients', patientSchema);
const antenatal = mongoose.models.antenatal || mongoose.model('antenatal', AnteNatalSchema);
const service = mongoose.models.serviceHistory || mongoose.model('ServiceHistorys', serviceHistory);
const payment = mongoose.models.serviceHistory || mongoose.model('PaymentHistorys', paymentHistory);
const staff = mongoose.models.staffs || mongoose.model('staffs', staffs);
const util = mongoose.models.utils || mongoose.model('utils', utils);
const queue = mongoose.models.queues || mongoose.model('queues', queues);
const register = mongoose.models.registers || mongoose.model('registers', registers);
const patientEdited = mongoose.models.patientEdits || mongoose.model('patientEdits', patientEdit);
const notifications = mongoose.models.notification || mongoose.model('notification', notification);
const vital = mongoose.models.vitals || mongoose.model('vitals', vitals);
const task = mongoose.models.tasks || mongoose.model('tasks', tasks);
const note = mongoose.models.notes || mongoose.model('notes', notes);
const labs = mongoose.models.labs || mongoose.model('labs', lab);
const scans = mongoose.models.scans || mongoose.model('scans', scan);
const request = mongoose.models.requests || mongoose.model('requests', requests);
const prescribes = mongoose.models.prescribe || mongoose.model('prescribe', prescribe);
const bill = mongoose.models.bills || mongoose.model('bills', bills);
const billRequests = mongoose.models.billRequests || mongoose.model('billRequests', billRequest);
const serve = mongoose.models.services || mongoose.model('services', services);
const handoffs = mongoose.models.handoff || mongoose.model('handoff', handoff);
const rosters = mongoose.models.roster || mongoose.model('roster', roster);
const medications = mongoose.models.medication || mongoose.model('medication', medication);
const labours = mongoose.models.labour || mongoose.model('labour', labour);
const babyschem = mongoose.models.baby || mongoose.model('baby', baby);
const urineschem = mongoose.models.urine || mongoose.model('urine', urine);
const churchBill = mongoose.models.church || mongoose.model('church', church);
const clinicalnotes = mongoose.models.clinicalnote || mongoose.model('clinicalnote', clinicalnote);
const expenses = mongoose.models.expense || mongoose.model('expense', expense);
const diagnos = mongoose.models.diagnosis || mongoose.model('diagnosis', diagnosis);
const patientdiagnos = mongoose.models.patientdiagnoses || mongoose.model('patientdiagnoses', patientdiagnoses);
const AnteNat = mongoose.models.AnteNatSub || mongoose.model('AnteNatSub', AnteNatSub);
const subscribes = mongoose.models.subscribe || mongoose.model('subscribe', subscribe);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(os.homedir(), 'contents', 'staffs');
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const staffUpload = multer({
    storage: storage
})

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {

        const uploadPath = path.join(os.homedir(), 'contents', 'scans');
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const scanupload = multer({
    storage: storage1
})

// Export models
module.exports = { Patient, antenatal, service, payment, staff, register, patientEdited, scanupload, staffUpload, queue, serve, util, notifications, vital, task, note, labs, scans, request, prescribes, bill, billRequests, handoffs, rosters, medications, labours, babyschem, urineschem, churchBill, clinicalnotes, expenses, diagnos, patientdiagnos, AnteNat, subscribes};