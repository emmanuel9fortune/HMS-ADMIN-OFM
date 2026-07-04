const bonjour = require('bonjour')()
const os = require('os')
const { app, BrowserWindow, Notification, powerSaveBlocker, screen, ipcMain } = require('electron');
const blockerId = powerSaveBlocker.start(`prevent-app-suspension`)
const path = require('path');
// require('electron-reload')(__dirname, {
//     watch:[
//         path.join(__dirname, './hospital/public'),
//         path.join(__dirname, './hospital/src')
//     ]
// })
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const MongoStore = require('rate-limit-mongo');


const http = require('http')

const {Server} = require('socket.io')

const addPatientRoutes = require('./server/reseption/addPatient');
const receptionistDashBoard = require('./server/reseption/dashboard');
const antenatal1 = require('./server/reseption/antenatal/anteNatalPatient1');
const antenatal3 = require('./server/reseption/antenatal/anteNatalPatient3');
const antenatal4 = require('./server/reseption/antenatal/anteNatalPatient4');
const antenatal5 = require('./server/reseption/antenatal/anteNatalPatient5');
const antenatal6 = require('./server/reseption/antenatal/anteNatalPatient6');
const antenatal7 = require('./server/reseption/antenatal/anteNatalPatient7');
const antenatal8 = require('./server/reseption/antenatal/anteNatalPatient8');
const operations = require('./server/reseption/antenatal/operations');
const addToQueue = require('./server/reseption/addToQueue');
const getQueue = require('./server/reseption/getQueue');
const deleteQueue = require('./server/reseption/deleteQueue');
const deleteTable = require('./server/reseption/deleteTable');
const getbills = require('./server/reseption/getBills'); 
const getPatientOnBill = require('./server/reseption/getPatientOnBill');
const patientCheckOut = require('./server/reseption/patientCheckOut');
const History = require('./server/reseption/History');
const updatePatientStatus = require('./server/reseption/updatePatientStatus');
const addDeposit = require('./server/reseption/addDeposit');
const getservices = require('./server/reseption/getservices');
const payout = require('./server/reseption/payout');
const adddept = require('./server/reseption/addDept');
const refund = require('./server/reseption/refund');
const DeleteBill = require('./server/reseption/DeleteBill');
const getInpatientRequest = require('./server/reseption/getInpatientRequest');
const InpatientOnBill = require('./server/reseption/InpatientOnBill');
const decline = require('./server/reseption/decline');
const addChurchBill = require('./server/reseption/addChurchBill');
const getChruchBill = require('./server/reseption/getChruchBill');
const patientBillDisapprove = require('./server/reseption/patientBillDisapprove');
const getDisapprovedBillPatient = require('./server/reseption/getDisapprovedBillPatient');
const getDisapprovedBill = require('./server/reseption/getDisapprovedBill');
const deleteConsume = require('./server/reseption/deleteConsume');
const getpatientBills = require('./server/reseption/getPatientBills');
const getBillPatieants = require('./server/reseption/getBillPatieants');
const updatechurchbill = require('./server/reseption/updatechurchbill');
const expenses = require('./server/reseption/expenses');
const AntenatalSearch = require('./server/AntenatalSearch');
const AntenatalDrugsearch = require('./server/AntenatalDrugsearch');
const audit = require('./server/reseption/audit');
const auditmonth = require('./server/reseption/auditmonth');
const debtors = require('./server/reseption/debtors');
const getDebtors = require('./server/reseption/getDebtors');
const getDebtorsPatient = require('./server/reseption/getDebtorsPatient');
const pendingBills = require('./server/reseption/pendingBills');

const getvitals = require('./server/nurse/getPatientVitals');
const deleteVitals = require('./server/nurse/deleteVitals');
const deleteMedication = require('./server/nurse/deleteMedication');
const deleteUrine = require('./server/nurse/deleteUrine');
const deleteBabyVital = require('./server/nurse/deleteBabyVital');
const deleteLabour = require('./server/nurse/deleteLabour');
const setvitals = require('./server/nurse/vitalSigns');
const nurseDashboard = require('./server/nurse/Dashboard');
const addtask = require('./server/nurse/addtask');
const updatetask = require('./server/nurse/updatetask');
const addnote = require('./server/nurse/addnote');
const nurseSearch = require('./server/nurse/searchUtilits');
const nurseBill = require('./server/nurse/sendBill');
const nurseUtils = require('./server/nurse/getUtils');
const GetHandOff = require('./server/nurse/GetHandOff');
const AddHandOff = require('./server/nurse/AddHandOff');
const medications = require('./server/nurse/medications');
const getmedications = require('./server/nurse/getmedications');
const labourChart = require('./server/nurse/labourChart');
const AddLabour = require('./server/nurse/AddLabour');
const AddBabyVitals = require('./server/nurse/AddBabyVitals');
const getBabyVitals = require('./server/nurse/getBabyVitals');
const getItems = require('./server/nurse/getItems');
const urineoutput = require('./server/nurse/urineoutput');
const geturineoutput = require('./server/nurse/geturineoutput');

const staffLogin = require('./server/staffLogin');
const staffLogout = require('./server/staffLogout');
const getPatientDetails = require('./server/getPatientDetails');
const editPatientDetails = require('./server/editPatientDetails');
const search = require('./server/search');

const createStaff = require('./server/admin/createStaff');
const getStaffs = require('./server/admin/getStaffs');
const deleteStaff = require('./server/admin/deleteStaff');
const AddUtils = require('./server/admin/AddUtils');
const getUtils = require('./server/admin/getUtils');
const deleteUtils = require('./server/admin/deleteUtils');
const Admdashboard = require('./server/admin/dashboard');
const batchanalist = require('./server/admin/batchAnalist');
const AddService = require('./server/admin/AddService');
const deleteService = require('./server/admin/deleteService');
const getService = require('./server/admin/getService');
const addroster = require('./server/admin/roster');
const getroster = require('./server/admin/getroster');
const deleteRoster = require('./server/admin/deleteRoster');
const editdrug = require('./server/admin/editdrug');
const editStaff = require('./server/admin/editStaff');
const EditUtils = require('./server/admin/EditUtils');
const UpdateReceipt = require('./server/admin/UpdateReceipt');
const getdiagnosis = require('./server/admin/getdiagnosis');
const searchDiagnosis = require('./server/admin/searchDiagnosis');
const getpatientdiagnosis = require('./server/admin/getpatientdiagnosis');
const deletdiagnosis = require('./server/admin/deletdiagnosis');
const deletpatientdiagnosis = require('./server/admin/deletpatientdiagnosis');
const Addpatientdiagnosis = require('./server/admin/AddPatientDiagnosis');
const Adddiagnosis = require('./server/admin/AddDiagnosis');
const datadiagnosis = require('./server/admin/datadiagnosis');
const deletePatient = require('./server/admin/deletePatient');
const antenatalsub = require('./server/admin/antenatalsub');
const edittest = require('./server/admin/edittest');
const editscan = require('./server/admin/editscan');
const addStaffUils = require('./server/admin/addStaffUtils');
const Addsubscript = require('./server/admin/Addsubscript');
const getsubscriptions = require('./server/admin/getsubscriptions');
const deletesubscription = require('./server/admin/deletesubscription');
const searchSubscription = require('./server/admin/searchSubscription');
const editservice = require('./server/admin/editservice');


const doctordashboard = require('./server/doctor/dashboard');
const viewScanLab = require('./server/doctor/viewScanLab');
const doctorRequest = require('./server/doctor/request');
const prescribe = require('./server/doctor/prescribe');
const getprescription = require('./server/doctor/getprescription');
const docSearch = require('./server/doctor/docSearch');
const docBill = require('./server/doctor/docBill');
const getPrevPrescrition = require('./server/doctor/getPrevPrescrition');
const patientTransactions = require('./server/doctor/patientTransactions');
const PrescribeInPatient = require('./server/doctor/PrescribeInPatient');
const discontinue = require('./server/doctor/discontinue');
const inpatientBill = require('./server/doctor/inpatientBill');
const searchRequest = require('./server/doctor/searchRequest');
const emergencyBill = require('./server/doctor/emergencyBill');
const ClinicalNote = require('./server/doctor/ClinicalNote');
const getClinicalNote = require('./server/doctor/getClinicalNote');
const consultation = require('./server/doctor/consultation');
const discount = require('./server/doctor/discount');
const procedure = require('./server/doctor/procedure');

const labdashboard = require('./server/lab/dashboard');
const runtest = require('./server/lab/runtest');
const uploadScan = require('./server/lab/uploadScan');
const getTestScan = require('./server/lab/getTestScan');
const getTests = require('./server/lab/getTests');
const closeScanTab = require('./server/lab/closeScanTab');

const pharmacyDashboard = require('./server/pharmacy/dashboard');
const searchutils = require('./server/pharmacy/searchutils');
const incDec = require('./server/pharmacy/IncDec');
const sendBill = require('./server/pharmacy/sendBill');
const utilityRequest = require('./server/pharmacy/utilityRequest');
const drugRequest = require('./server/pharmacy/drugRequest');
const utilsDispenser = require('./server/pharmacy/utilsDispenser');
const dispencehistory = require('./server/pharmacy/dispencehistory');
const { setIO } = require('./socketManager');

// Connect MongoDB

const uri = 'mongodb://localhost:27017/ofm';

let store;

const setupMongoStore = async () => {
    try {
        store = new MongoStore({
            uri: 'mongodb://localhost:27017/ofm',
            collectionName: 'rateLimit',
            expireTimeMs: 15 * 60 * 1000,
            userKey: (req) => req.ip,
        });
        ('MongoStore initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize MongoStore:', error.message);
    }
};

setupMongoStore();

const options = {
    maxPoolSize: 1000, // Adjust connection pool size as needed
    serverSelectionTimeoutMS: 5000
};
// ---------------------- //
// ---getting current user info -- //
// ---------------- ///

const connectWithRetry = () => {
    mongoose.connect(uri, options)
        .then(() => ('Connected to MongoDB'))
        .catch((error) => {
            console.error('Error connecting to MongoDB, retrying in 5 seconds...', error);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// Listen for successful connection
mongoose.connection.once('open', () => {
    ('Connected to MongoDB');
});

// Optional: Additional event listeners for connection management
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    ('MongoDB connection disconnected');
});


// Rate limiter middleware
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        message: "Too many attempts from this IP, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});


///////////////////////////////////////////////////////
// Create Express Server
function createServer() {
    const serverApp = express();
    serverApp.use(cors({
        origin: '*' ,
        methods: ['GET', 'POST'],
    }));
    const uploadPath = path.join(os.homedir(), 'contents');
    
    serverApp.use((req, res, next)=>{
      req.setTimeout(15000)
      req.setTimeout(15000)
      next()
    })

    serverApp.use(express.json({limit: "1gb"}));
    serverApp.use(express.urlencoded({
        limit: "1gb",
        extended: true
    }));
    serverApp.use('/uploads', express.static(uploadPath))
    serverApp.use(cookieParser());
    serverApp.use(bodyParser.json({limit: "1gb"}));
    serverApp.use(bodyParser.urlencoded({limit: "1gb", extended: true}));
    

    const server = http.createServer(serverApp)

    const io = new Server(server,{
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
    })

    setIO(io)

    io.on("connection",(socket)=>{
        // ('user connected', socket.id)

        socket.on("join_room", (data)=>{
            // (`Socket ${socket.id} joined room ${data}`);
            socket.join(data);
        })
        socket.on("message", (data)=>{
            (data)
            // socket.to(data.room).emit("receive_message", data)
        })
        socket.on('disconnect', () => {
            ('❌ Socket disconnected:', socket.id);
        });
    })

    // setInterval(() => {
    //     io.to('nurse').emit('message', 'New patient vitals submitted');
    // }, 10000);

    module.exports = {io, server}
    
    serverApp.use(session({ 
        secret:'secret',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)) // Expires 30 days from now
        }
    }));

    
    serverApp.use(express.static(path.join(__dirname, 'build')));
    serverApp.get('/', (req, res)=>{
        res.sendFile(path.join(__dirname, 'build', 'index.html'))
    })
    
    serverApp.use(express.static(path.join(__dirname, 'hospital', 'build')));
    serverApp.get('/admin_dashboard_display_center', (req, res)=>{
        res.sendFile(path.join(__dirname, 'hospital', 'build', 'index.html'))
    })






    
    serverApp.set('trust proxy', 1);

    serverApp.use('/addPatient', addPatientRoutes);
    serverApp.use('/receptionistDashBoard', receptionistDashBoard);
    serverApp.use('/antenatal1', antenatal1);
    serverApp.use('/antenatal3', antenatal3);
    serverApp.use('/antenatal4', antenatal4);
    serverApp.use('/antenatal5', antenatal5);
    serverApp.use('/antenatal6', antenatal6);
    serverApp.use('/antenatal7', antenatal7);
    serverApp.use('/antenatal8', antenatal8);
    serverApp.use('/operations', operations);
    serverApp.use('/deleteTable', deleteTable);
    serverApp.use('/getbills', getbills);
    serverApp.use('/getPatientOnBill', getPatientOnBill);
    serverApp.use('/patientCheckOut', patientCheckOut);
    serverApp.use('/History', History);
    serverApp.use('/updatePatientStatus', updatePatientStatus);
    serverApp.use('/addDeposit', addDeposit);
    serverApp.use('/getservices', getservices);
    serverApp.use('/payout', payout);
    serverApp.use('/adddept', adddept);
    serverApp.use('/refund', refund);
    serverApp.use('/getInpatientRequest', getInpatientRequest);
    serverApp.use('/InpatientOnBill', InpatientOnBill);
    serverApp.use('/decline', decline);
    serverApp.use('/addChurchBill', addChurchBill);
    serverApp.use('/getChruchBill', getChruchBill);
    serverApp.use('/patientBillDisapprove', patientBillDisapprove);
    serverApp.use('/getDisapprovedBillPatient', getDisapprovedBillPatient);
    serverApp.use('/getDisapprovedBill', getDisapprovedBill);
    serverApp.use('/emergencyBill', emergencyBill);
    serverApp.use('/ClinicalNote', ClinicalNote);
    serverApp.use('/deleteConsume', deleteConsume);
    serverApp.use('/getpatientBills', getpatientBills);
    serverApp.use('/getBillPatieants', getBillPatieants);
    serverApp.use('/updatechurchbill', updatechurchbill);
    serverApp.use('/AntenatalSearch', AntenatalSearch);
    serverApp.use('/AntenatalDrugsearch', AntenatalDrugsearch);
    serverApp.use('/DeleteBill', DeleteBill);
    serverApp.use('/expenses', expenses);
    serverApp.use('/audit', audit);
    serverApp.use('/debtors', debtors);
    serverApp.use('/getDebtors', getDebtors);
    serverApp.use('/getDebtorsPatient', getDebtorsPatient);
    serverApp.use('/pendingBills', pendingBills);
    
    serverApp.use('/staffLogin', staffLogin);

    serverApp.use('/createStaff', createStaff);
    serverApp.use('/getStaffs', getStaffs);
    serverApp.use('/getUtils', getUtils);
    serverApp.use('/deleteStaff', deleteStaff);
    serverApp.use('/deleteUtils', deleteUtils);
    serverApp.use('/AddUtils', AddUtils);
    serverApp.use('/Admdashboard', Admdashboard);
    serverApp.use('/batchanalist', batchanalist);
    serverApp.use('/AddService', AddService);
    serverApp.use('/deleteService', deleteService);
    serverApp.use('/getService', getService);
    serverApp.use('/addroster', addroster);
    serverApp.use('/getroster', getroster);
    serverApp.use('/deleteRoster', deleteRoster);
    serverApp.use('/urineoutput', urineoutput);
    serverApp.use('/deleteVitals', deleteVitals);
    serverApp.use('/deleteMedication', deleteMedication);
    serverApp.use('/deleteUrine', deleteUrine);
    serverApp.use('/deleteBabyVital', deleteBabyVital);
    serverApp.use('/deleteLabour', deleteLabour);
    serverApp.use('/geturineoutput', geturineoutput);
    serverApp.use('/consultation', consultation);
    serverApp.use('/editdrug', editdrug);
    serverApp.use('/editStaff', editStaff);
    serverApp.use('/EditUtils', EditUtils);
    serverApp.use('/UpdateReceipt', UpdateReceipt);
    serverApp.use('/auditmonth', auditmonth);
    serverApp.use('/antenatalsub', antenatalsub);
    serverApp.use('/addStaffUils', addStaffUils);
    serverApp.use('/Addsubscript', Addsubscript);
    serverApp.use('/getsubscriptions', getsubscriptions);
    serverApp.use('/deletesubscription', deletesubscription);
    serverApp.use('/searchSubscription', searchSubscription);
    
    serverApp.use('/staffLogout', staffLogout);
    serverApp.use('/getPatientDetails', getPatientDetails);
    serverApp.use('/search', search);
    serverApp.use('/editPatientDetails', editPatientDetails);
    serverApp.use('/addToQueue', addToQueue);
    serverApp.use('/getQueue', getQueue);
    serverApp.use('/deleteQueue', deleteQueue);
    
    serverApp.use('/doctordashboard', doctordashboard);
    serverApp.use('/viewScanLab', viewScanLab);
    serverApp.use('/doctorRequest', doctorRequest);
    serverApp.use('/prescribe', prescribe);
    serverApp.use('/getprescription', getprescription);
    serverApp.use('/nurseSearch', nurseSearch);
    serverApp.use('/docSearch', docSearch);
    serverApp.use('/docBill', docBill);
    serverApp.use('/getPrevPrescrition', getPrevPrescrition);
    serverApp.use('/patientTransactions', patientTransactions);
    serverApp.use('/PrescribeInPatient', PrescribeInPatient);
    serverApp.use('/discontinue', discontinue);
    serverApp.use('/getClinicalNote', getClinicalNote);
    serverApp.use('/inpatientBill', inpatientBill);
    serverApp.use('/searchRequest', searchRequest);
    serverApp.use('/discount', discount);
    serverApp.use('/procedure', procedure);
    serverApp.use('/getdiagnosis', getdiagnosis);
    serverApp.use('/getpatientdiagnosis', getpatientdiagnosis);
    serverApp.use('/deletdiagnosis', deletdiagnosis);
    serverApp.use('/deletpatientdiagnosis', deletpatientdiagnosis);
    serverApp.use('/Addpatientdiagnosis', Addpatientdiagnosis);
    serverApp.use('/Adddiagnosis', Adddiagnosis);
    serverApp.use('/datadiagnosis', datadiagnosis);
    serverApp.use('/deletePatient', deletePatient);
    serverApp.use('/searchDiagnosis', searchDiagnosis);
    serverApp.use('/edittest', edittest);
    serverApp.use('/editscan', editscan);
    serverApp.use('/editservice', editservice);
    
    serverApp.use('/getvitals', getvitals);
    serverApp.use('/setvitals', setvitals);
    serverApp.use('/nurseDashboard', nurseDashboard);
    serverApp.use('/addnote', addnote);
    serverApp.use('/addtask', addtask);
    serverApp.use('/updatetask', updatetask);
    serverApp.use('/nurseBill', nurseBill);
    serverApp.use('/nurseUtils', nurseUtils);
    serverApp.use('/AddHandOff', AddHandOff);
    serverApp.use('/getmedications', getmedications);
    serverApp.use('/medications', medications);
    serverApp.use('/GetHandOff', GetHandOff);
    serverApp.use('/labourChart', labourChart);
    serverApp.use('/AddLabour', AddLabour);
    serverApp.use('/AddBabyVitals', AddBabyVitals);
    serverApp.use('/getBabyVitals', getBabyVitals);
    serverApp.use('/getItems', getItems);

    serverApp.use('/labdashboard', labdashboard);
    serverApp.use('/runtest', runtest);
    serverApp.use('/uploadScan', uploadScan);
    serverApp.use('/getTestScan', getTestScan);
    serverApp.use('/getTests', getTests);
    serverApp.use('/closeScanTab', closeScanTab);

    serverApp.use('/pharmacyDashboard', pharmacyDashboard);
    serverApp.use('/searchutils', searchutils);
    serverApp.use('/incDec', incDec);
    serverApp.use('/sendBill', sendBill);
    serverApp.use('/utilityRequest', utilityRequest);
    serverApp.use('/drugRequest', drugRequest);
    serverApp.use('/utilsDispenser', utilsDispenser);
    serverApp.use('/dispencehistory', dispencehistory);

    serverApp.use((req, res) => {
        res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
    });

    server.listen(7700, '0.0.0.0', () => ('Server running on http://localhost:7700'));

    server.keepAliveTimeout = 5000
    server.headersTimeout = 6000

    // Network helpers
    let bonjourService = null;
    let currentIP = null;

    // Get current IPv4 address
    function getActiveIPv4() {
        const interfaces = os.networkInterfaces();
        for (const name in interfaces) {
            for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
            }
        }
        return null;
    }
    
    ipcMain.handle('get-local-ip', async () => {
        return getActiveIPv4();
    });

    function isValidIPv4(ip) {
        return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
    }

    // Republish Bonjour if IP changes
    function publishBonjour(ip) {
        if (!isValidIPv4(ip)) {
            console.warn(`Invalid IP for Bonjour publishing: ${ip}`);
            return;
        }

        if (bonjourService) {
            bonjourService.stop(() => {
            ('Old Bonjour service stopped.');
            });
        }

        bonjourService = bonjour.publish({
            name: 'ofm_Med_Server',
            type: 'http',
            port: 7700,
        });

        (`Bonjour published on new IP: ${ip}`);
    }


    function monitorNetworkAndPublishBonjour() {
        setInterval(() => {
            const newIP = getActiveIPv4();

            if (newIP && newIP !== currentIP) {
                (`Network change detected. New IP: ${newIP}`);
                currentIP = newIP;
                publishBonjour(currentIP);
            }

            if (!newIP && currentIP) {
                console.warn('Lost network connection. Unpublishing Bonjour.');
                if (bonjourService) {
                        bonjourService.stop(() => {
                        ('Bonjour service stopped due to disconnection.');
                    });
                    bonjourService = null;
                    currentIP = null;
                }
            }
        }, 5000); // check every 5 seconds
    }

    // Start monitoring Bonjour
    monitorNetworkAndPublishBonjour();
}

///////////////////////////////////////////////////////
// Create Electron Window
function createWindow() {

    const {width, height} = screen.getPrimaryDisplay().workAreaSize

    const win = new BrowserWindow({
        width: width,
        height: height,
        minHeight: height * 0.8,
        icon: path.join(__dirname, 'hospital', 'build', 'logo.jpg'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    // win.loadURL('http://localhost:3000')

    const buildPath = path.join(__dirname, 'hospital', 'build', 'index.html');
    win.loadFile(buildPath)

    const notification = new Notification({
        title: 'My Electron App',
        body: 'This is a notification from your app!'
    });

    notification.onclick = () => {};
    notification.show();
}

function discoverBonjourService() {
  try {
    return new Promise((resolve, reject) => {
        const browser = bonjour.find({ type: 'http' });

        browser.on('up', (service) => {
        if (service.name === 'ofm_Med_Server') {
            const ip = service.referer.address; // IP address of the host
            ("Discovered IP:", ip);
            browser.stop(); // Stop discovery once found
            resolve(ip);
        }
        });

        setTimeout(() => {
        browser.stop();
        reject('Service not found');
        }, 5000); // Timeout after 5 seconds
    });
  } catch (error) {
    (error);
  }

}

ipcMain.handle('get-server-ip', async () => {
  try {
    const ip = await discoverBonjourService();
    return ip;
  } catch (err) {
    return null;
  }
});

app.commandLine.appendSwitch(
    "disable-http-cache"
)

///////////////////////////////////////////////////////
// App Lifecycle
app.whenReady().then(() => {
    createWindow();
    createServer();
        
    const notification = new Notification({
        title: 'O.F.M. Medical center',
        body: 'Nurses dashboard display'
    });
    notification.onclick = () => {};
    notification.show();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

function isConnectedToWifi() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    const ifaceList = interfaces[name];
    for (const iface of ifaceList) {
      if (
        iface.family === 'IPv4' &&
        !iface.internal &&
        name.toLowerCase().includes('wi') // catches wlan, wifi, etc.
      ) {
        return true;
      }
    }
  }
  return false;
}

function monitorWifiAndControlSleep() {
  setInterval(() => {
    const connected = isConnectedToWifi();

    if (connected && blockerId === null) {
      blockerId = powerSaveBlocker.start('prevent-app-suspension');
      ('Connected to WiFi: Keeping system awake.');
    }

    if (!connected && blockerId !== null) {
      powerSaveBlocker.stop(blockerId);
      blockerId = null;
      ('WiFi disconnected: Allowing system to sleep.');
    }
  }, 5000); // check every 5 seconds
}