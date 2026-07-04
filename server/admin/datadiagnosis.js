const express = require('express');
const router = express.Router();
const { staff, staffUpload, patientdiagnos, Patient } = require('../../model');

// 🧠 Helper function to convert any age + AgeType to years
function convertToYears(age, type) {
  switch (type) {
    case 'days': return age / 365;
    case 'weeks': return age / 52;
    case 'months': return age / 12;
    case 'years': 
    default: return age;
  }
}

// 🧩 Common age group definitions (in years)
const ageGroups = [
  { name: "", range1: 0, range2: 208 },
  { name: "new", range1: 0, range2: 0.08 },      // ~30 days
  { name: "under", range1: 0, range2: 5 },
  { name: "child", range1: 0, range2: 12 },
  { name: "adolescence", range1: 0, range2: 18 },
  { name: "adult", range1: 18, range2: 39 },
  { name: "middle", range1: 40, range2: 65 },
  { name: "elder", range1: 65, range2: 200 },
];

/* -----------------------------------------
   📍 ROUTE: GENERAL DIAGNOSIS FILTER
------------------------------------------ */
router.post('/', async (req, res) => {
  try {
    const { location, diagnosis, sex, type, age, unix, eunix } = req.body;

    const agefilter = ageGroups.find(item => item.name === age);

    // 🧠 Step 1: Get all patients (then filter manually by converted age)
    let patientQuery = {};
    if (location) patientQuery.address = { $regex: location, $options: 'i' };
    if (sex) patientQuery.sex = sex;

    const allPatients = await Patient.find(patientQuery);

    // 🧮 Normalize age to years before filtering
    let filteredPatients = allPatients;
    if (agefilter?.name) {
      filteredPatients = allPatients.filter(p => {
        const ageInYears = convertToYears(p.age, p.AgeType);
        return ageInYears >= agefilter.range1 && ageInYears <= agefilter.range2;
      });
    }

    const patientIDs = filteredPatients.map(p => p._id);

    // 🧠 Step 2: Diagnosis query
    const diagnosQuery = {};
    if (unix && eunix) diagnosQuery.timeStamp = { $gte: unix, $lte: eunix };
    if (type) diagnosQuery.type = type;
    if (diagnosis) diagnosQuery.name = diagnosis;
    if (patientIDs.length > 0) diagnosQuery.uid = { $in: patientIDs };

    const diagnos = await patientdiagnos.find(diagnosQuery).populate('uid');

    return res.json({
      status: 'success',
      diagnos,
      patients: filteredPatients,
      filtersUsed: { location, sex, age, type, diagnosis, unix, eunix },
    });

  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

/* -----------------------------------------
   📍 ROUTE: MONTHLY DIAGNOSIS FILTER
------------------------------------------ */
router.post('/month', async (req, res) => {
  try {
    const { year, month, location, diagnosis, sex, age, type } = req.body;
    if (!month || !year) {
      return res.status(400).json({ status: 'error', message: 'Missing year or month' });
    }

    // 🕒 Month start/end timestamps
    const unix = new Date(year, month - 1, 1).getTime();
    const eunix = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    const agefilter = ageGroups.find(item => item.name === age);

    // 🧠 Get all patients and filter manually
    let patientQuery = {};
    if (location) patientQuery.address = { $regex: location, $options: 'i' };
    if (sex) patientQuery.sex = sex;

    const allPatients = await Patient.find(patientQuery);

    let filteredPatients = allPatients;
    if (agefilter?.name) {
      filteredPatients = allPatients.filter(p => {
        const ageInYears = convertToYears(p.age, p.AgeType);
        return ageInYears >= agefilter.range1 && ageInYears <= agefilter.range2;
      });
    }

    const patientIDs = filteredPatients.map(p => p._id);

    // 🩺 Diagnosis query
    const diagnosQuery = { timeStamp: { $gte: unix, $lte: eunix } };
    if (type) diagnosQuery.type = type;
    if (diagnosis) diagnosQuery.name = diagnosis;
    if (patientIDs.length > 0) diagnosQuery.uid = { $in: patientIDs };

    const diagnos = await patientdiagnos.find(diagnosQuery).populate('uid');

    return res.json({
      status: 'success',
      period: 'month',
      year,
      month,
      diagnos,
      patients: filteredPatients,
      filtersUsed: { location, sex, age, type, diagnosis },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/* -----------------------------------------
   📍 ROUTE: YEARLY DIAGNOSIS FILTER
------------------------------------------ */
router.post('/year', async (req, res) => {
  try {
    const { year, location, diagnosis, sex, age, type } = req.body;
    if (!year) {
      return res.status(400).json({ status: 'error', message: 'Missing year' });
    }

    // 🕒 Year start/end timestamps
    const unix = new Date(year, 0, 1).getTime();
    const eunix = new Date(year, 11, 31, 23, 59, 59, 999).getTime();

    const agefilter = ageGroups.find(item => item.name === age);

    // 🧠 Get and filter patients
    let patientQuery = {};
    if (location) patientQuery.address = { $regex: location, $options: 'i' };
    if (sex) patientQuery.sex = sex;

    const allPatients = await Patient.find(patientQuery);

    let filteredPatients = allPatients;
    if (agefilter?.name) {
      filteredPatients = allPatients.filter(p => {
        const ageInYears = convertToYears(p.age, p.AgeType);
        return ageInYears >= agefilter.range1 && ageInYears <= agefilter.range2;
      });
    }

    const patientIDs = filteredPatients.map(p => p._id);

    // 🩺 Diagnosis query
    const diagnosQuery = { timeStamp: { $gte: unix, $lte: eunix } };
    if (type) diagnosQuery.type = type;
    if (diagnosis) diagnosQuery.name = diagnosis;
    if (patientIDs.length > 0) diagnosQuery.uid = { $in: patientIDs };

    const diagnos = await patientdiagnos.find(diagnosQuery).populate('uid');

    return res.json({
      status: 'success',
      period: 'year',
      year,
      diagnos,
      patients: filteredPatients,
      filtersUsed: { location, sex, age, type, diagnosis },
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
