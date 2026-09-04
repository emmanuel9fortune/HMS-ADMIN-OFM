const express = require('express');
const router = express.Router();
const { Patient } = require('../../model');

// Convert age to years
function convertToYears(age, type) {
  age = Number(age);

  if (isNaN(age)) return 0;

  switch (type) {
    case 'days':
      return age / 365;
    case 'weeks':
      return age / 52;
    case 'months':
      return age / 12;
    case 'years':
    default:
      return age;
  }
}

// Age groups
const ageGroups = [
  { name: 'new', range1: 0, range2: 0.08 },
  { name: 'under', range1: 0, range2: 5 },
  { name: 'child', range1: 0, range2: 12 },
  { name: 'adolescence', range1: 12, range2: 18 },
  { name: 'adult', range1: 18, range2: 39 },
  { name: 'middle', range1: 40, range2: 65 },
  { name: 'elder', range1: 65, range2: 200 }
];


/*
==================================================
GET PATIENTS BY CUSTOM TIMESTAMP PERIOD
==================================================
*/

router.post('/', async (req, res) => {
  try {

    const {
      unix,
      eunix,
      age,
      sex,
      status
    } = req.body;

    if (!unix || !eunix) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing unix or eunix'
      });
    }

    // Build MongoDB query
    const patientQuery = {
      timeStamp: {
        $gte: Number(unix),
        $lte: Number(eunix)
      }
    };

    // Sex
    if (sex) {
      patientQuery.sex = sex;
    }

    // Status
    if (status) {
      if(status === 'outpatient'){
        patientQuery.status = {
          $in: ['nurse', 'doctor', 'pharmacy', 'cashier']
        };
      }else{
        patientQuery.status = status;
      }
    } 

    // Get patients from database
    let patients = await Patient.find(patientQuery);

    // Age filter
    const ageFilter = ageGroups.find(
      item => item.name === age
    );

    if (ageFilter) {

      patients = patients.filter(patient => {

        const ageInYears = convertToYears(
          patient.age,
          patient.AgeType
        );

        return (
          ageInYears >= ageFilter.range1 &&
          ageInYears <= ageFilter.range2
        );

      });

    }

    return res.json({
      status: 'success',

      total: patients.length,

      patients,

      filtersUsed: {
        unix,
        eunix,
        age,
        sex,
        status
      }
    });

  } catch (error) {

    console.error(
      'PATIENT STATISTICS ERROR:',
      error
    );

    return res.status(500).json({
      status: 'error',
      message: error.message
    });

  }
});

/*
==================================================
GET PATIENTS BY DAY
==================================================
*/

router.post('/day', async (req, res) => {

  try {

    const {
      year,
      month,
      day,
      age,
      sex,
      status
    } = req.body;

    if (!year || !month || !day) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing year, month or day'
      });
    }

    const selectedYear = Number(year);
    const selectedMonth = Number(month);
    const selectedDay = Number(day);

    // Start of selected day
    const unix = Date.UTC(
      selectedYear,
      selectedMonth - 1,
      selectedDay,
      0,
      0,
      0,
      0
    );

    // End of selected day
    const eunix = Date.UTC(
      selectedYear,
      selectedMonth - 1,
      selectedDay,
      23,
      59,
      59,
      999
    );

    // Convert stored STRING timestamp to NUMBER
    const patientQuery = {

      $expr: {

        $and: [

          {
            $gte: [
              {
                $convert: {
                  input: "$timeStamp",
                  to: "long",
                  onError: null,
                  onNull: null
                }
              },
              unix
            ]
          },

          {
            $lte: [
              {
                $convert: {
                  input: "$timeStamp",
                  to: "long",
                  onError: null,
                  onNull: null
                }
              },
              eunix
            ]
          }

        ]

      }

    };

    // SEX
    if (sex) {
      patientQuery.sex = sex;
    }

    // STATUS
    if (status) {
      if(status === 'outpatient'){
        patientQuery.status = {
          $in: ['nurse', 'doctor', 'pharmacy', 'cashier']
        };
      }else{
        patientQuery.status = status;
      }
    } 

    let patients = await Patient.find(patientQuery);

    // ==========================================
    // AGE FILTER
    // ==========================================

    if (age && age.trim() !== '') {

      const ageFilter = ageGroups.find(
        item => item.name === age
      );

      if (ageFilter) {

        patients = patients.filter(patient => {

          const ageInYears = convertToYears(
            patient.age,
            patient.AgeType
          );

          // Missing age is NOT an infant
          if (ageInYears === null) {
            return false;
          }

          return (
            ageInYears >= ageFilter.range1 &&
            ageInYears <= ageFilter.range2
          );

        });

      }

    }

    return res.json({

      status: 'success',

      period: 'day',

      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,

      total: patients.length,

      patients,

      filtersUsed: {
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay,
        age,
        sex,
        status,
        unix,
        eunix
      }

    });

  } catch (error) {

    console.error(
      'DAILY PATIENT STATISTICS ERROR:',
      error
    );

    return res.status(500).json({
      status: 'error',
      message: error.message
    });

  }

});


/*
==================================================
GET PATIENTS BY MONTH
==================================================
*/

router.post('/month', async (req, res) => {

  try {

    const {
      year,
      month,
      age,
      sex,
      status
    } = req.body;

    if (!year || !month) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing year or month'
      });
    }

    const unix = new Date(
      year,
      month - 1,
      1,
      0,
      0,
      0,
      0
    ).getTime();

    const eunix = new Date(
      year,
      month,
      0,
      23,
      59,
      59,
      999
    ).getTime();

    const patientQuery = {
        $expr: {
            $and: [
            {
                $gte: [
                {
                    $convert: {
                    input: "$timeStamp",
                    to: "long",
                    onError: null,
                    onNull: null
                    }
                },
                unix
                ]
            },
            {
                $lte: [
                {
                    $convert: {
                    input: "$timeStamp",
                    to: "long",
                    onError: null,
                    onNull: null
                    }
                },
                eunix
                ]
            }
            ]
        }
    };

    if (sex) {
      patientQuery.sex = sex;
    }

    if (status) {
      if(status === 'outpatient'){
        patientQuery.status = {
          $in: ['nurse', 'doctor', 'pharmacy', 'cashier']
        };
      }else{
        patientQuery.status = status;
      }
    } 

    let patients = await Patient.find(patientQuery);

    // Age filter
    const ageFilter = ageGroups.find(
      item => item.name === age
    );

    if (ageFilter) {

      patients = patients.filter(patient => {

        const ageInYears = convertToYears(
          patient.age,
          patient.AgeType
        );

        return (
          ageInYears >= ageFilter.range1 &&
          ageInYears <= ageFilter.range2
        );

      });

    }
    

    return res.json({

      status: 'success',

      period: 'month',

      year,
      month,

      total: patients.length,

      patients,

      filtersUsed: {
        year,
        month,
        age,
        sex,
        status,
        unix,
        eunix
      }

    });

  } catch (error) {

    console.error(
      'MONTHLY PATIENT STATISTICS ERROR:',
      error
    );

    return res.status(500).json({
      status: 'error',
      message: error.message
    });

  }

});


/*
==================================================
GET PATIENTS BY YEAR
==================================================
*/

router.post('/year', async (req, res) => {

  try {

    const {
      year,
      age,
      sex,
      status
    } = req.body;

    if (!year) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing year'
      });
    }

    const unix = new Date(
      year,
      0,
      1,
      0,
      0,
      0,
      0
    ).getTime();

    const eunix = new Date(
      year,
      11,
      31,
      23,
      59,
      59,
      999
    ).getTime();

    const patientQuery = {
        $expr: {
            $and: [
            {
                $gte: [
                { $toLong: "$timeStamp" },
                Number(unix)
                ]
            },
            {
                $lte: [
                { $toLong: "$timeStamp" },
                Number(eunix)
                ]
            }
            ]
        }
    };

    if (sex) {
      patientQuery.sex = sex;
    }

    if (status) {
      if(status === 'outpatient'){
        patientQuery.status = {
          $in: ['nurse', 'doctor', 'pharmacy', 'cashier']
        };
      }else{
        patientQuery.status = status;
      }
    } 

    let patients = await Patient.find(patientQuery);

    // Age filter
    const ageFilter = ageGroups.find(
      item => item.name === age
    );

    if (ageFilter) {

      patients = patients.filter(patient => {

        const ageInYears = convertToYears(
          patient.age,
          patient.AgeType
        );

        return (
          ageInYears >= ageFilter.range1 &&
          ageInYears <= ageFilter.range2
        );

      });

    }

    return res.json({

      status: 'success',

      period: 'year',

      year,

      total: patients.length,

      patients,

      filtersUsed: {
        year,
        age,
        sex,
        status,
        unix,
        eunix
      }

    });

  } catch (error) {

    console.error(
      'YEARLY PATIENT STATISTICS ERROR:',
      error
    );

    return res.status(500).json({
      status: 'error',
      message: error.message
    });

  }

});


module.exports = router;