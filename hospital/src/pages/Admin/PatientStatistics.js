import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import axios from 'axios'
import { FaChevronLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function PatientStatistics() {
  const cip = window.location.hostname
  const [selectedDay, setSelectedDay] = useState('');
  
  const [getPatient, setgetPatient] = useState([])
  const [age, setage] = useState('')
  const [date, setdate] = useState('')
  const [status, setStatus] = useState('')
  const [enddate, setenddate] = useState('')
  const [mnth, setmnth] = useState('')
  const [yr, setyr] = useState('')
  const [sex, setsex] = useState('')

  useEffect(()=>{
      const raw = 7
      const now = Date.now()

      const DaysAgo = now - raw * 24 * 60 * 60 * 1000

      setdate(DaysAgo);
      setenddate(now);
  },[])
  
  
  useEffect(()=>{
      const controller = new AbortController()
      const func =async()=>{            
          try {
              await axios.post(`http://${cip || 'localhost'}:7700/patientStats`, { unix: date, eunix: enddate, sex, age, status}).then((res)=>{                
                  if(res.data.status === 'success'){
                      setgetPatient(res.data.patients)
                  }
              })
          } catch (error) {
              console.log(error);
          }
      }
      func()
      return ()=> controller.abort()
  },[cip, date, enddate, sex, age, status])

  const handlePeriod =(e) => {
    const raw = e.target.value;
    const now = Date.now()

    const DaysAgo = now - raw * 24 * 60 * 60 * 1000

    setdate(DaysAgo);
    setenddate(now);
  }

  const handlePeriodByMonth = async(e) => {
    const month = Number(e.target.value);

    setmnth(month);

    let year = Number(yr);

    if (!year) {
        year = new Date().getFullYear();
    }

    const start = new Date(year, month - 1, 1).getTime();
    const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

    setdate(start);
    setenddate(end);
    // Then fetch uses effect or you can call manually:
    await axios.post(`http://${cip || 'localhost' }:7700/patientStats/month`, { year, month, age, sex, status})
    .then((res)=>{
        if(res.data.status === 'success'){
            setgetPatient(res.data.patients)
        }
    })
  };
  
  const handlePeriodByyEAR = async(e) => {
      const year = Number(e.target.value); // e.g., 2025 selected from dropdown
      setyr(year)
      setmnth(1);
      // Define full year range
      const start = new Date(year, 0, 1).getTime(); // Jan 1, 00:00
      const end = new Date(year, 11, 31, 23, 59, 59, 999).getTime(); // Dec 31, 23:59:59

      setdate(start);
      setenddate(end);

      try {
          const res = await axios.post(`http://${cip || 'localhost'}:7700/patientStats/year`, { year, age, sex, status});          
          if(res.data.status === 'success'){
              setgetPatient(res.data.patients)
          }
      } catch (err) {
          console.error('Error fetching yearly data:', err);
      }
  };
  
  const handleDailyReport = async (e) => {

    const value = e.target.value;

    setSelectedDay(value);

    if (!value) return;

    const [year, month, day] = value
        .split('-')
        .map(Number);

    try {

        const res = await axios.post(
            `http://${cip || 'localhost'}:7700/patientStats/day`,
            {
                year,
                month,
                day,
                age,
                sex,
                status
            }
        );

        if (res.data.status === 'success') {
          setgetPatient(res.data.patients);
        }

    } catch (error) {

        console.error(
            'Error fetching daily report:',
            error
        );

    }
};
    
      
  
  const currentYear = new Date().getFullYear();
  const startYear = 2025; // or the first year your app started saving data
  const years = [];

  for (let y = currentYear; y >= startYear; y--) {
      years.push(y);
  }

  const getPatientReportNotice = () => {

    const total = getPatient.length;

    // AGE
    let ageText = 'all age groups';

    if (age === 'new') {
      ageText = 'newborn patients';
    } else if (age === 'under') {
      ageText = 'patients under 5 years';
    } else if (age === 'child') {
      ageText = 'children under 12 years';
    } else if (age === 'adolescence') {
      ageText = 'adolescent patients';
    } else if (age === 'adult') {
      ageText = 'adult patients';
    } else if (age === 'middle') {
      ageText = 'middle-aged patients';
    } else if (age === 'elder') {
      ageText = 'elderly patients';
    }

    // SEX
    let sexText = 'male and female patients';

    if (sex === 'male') {
      sexText = 'male patients';
    } else if (sex === 'female') {
      sexText = 'female patients';
    }

    // STATUS
    let statusText = 'all patient statuses';

    if (status === 'inpatient') {
      statusText = 'inpatients';
    } else if (status === 'outpatient') {
      statusText = 'outpatients';
    } else if (status === 'emergency') {
      statusText = 'emergency patients';
    }

    // PERIOD
    let periodText = 'the selected period';

    if (selectedDay) {

      const date = new Date(selectedDay);

      periodText = date.toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

    } else if (mnth && yr) {

      const date = new Date(
        Number(yr),
        Number(mnth) - 1,
        1
      );

      periodText = date.toLocaleDateString('en-NG', {
        month: 'long',
        year: 'numeric'
      });

    } else if (yr) {

      periodText = `the year ${yr}`;

    } else if (date && enddate) {

      const start = new Date(Number(date));
      const end = new Date(Number(enddate));

      periodText = `${start.toLocaleDateString('en-NG')} to ${end.toLocaleDateString('en-NG')}`;

    }

    return `A total of ${total} ${total === 1 ? 'patient was' : 'patients were'} recorded for ${periodText}. This report covers ${statusText}, with ${ageText}, including ${sexText}.`;
  };

  return (
    <div className='dashboard_container'>
      <AdminBar/> 

      <div className='dashboard_body' >
        
        <Link to={'/'} className='back_btn_' >
            <FaChevronLeft />
            <h4>BACK</h4>
        </Link>

        <div className="patient_report_notice" style={{margin:'20px 0'}}>
          <h3>Patient Report</h3>

          <p style={{fontSize:'20px'}} >
              {getPatientReportNotice()}
          </p>
        </div>

        <p style={{fontSize:'20px', backgroundColor:'red', color:'white', padding:'10px'}}>NOTE: First select patient type, patient status, choose sex before selecting dates to get your desired results</p>

        <div style={{display:'flex', alignItems:'center', width:'100%'}}>
          <div className='patient_details_input_field1_in_' style={{margin:'0 5px'}}>

            <div className='patient_details_input_field1_' >
              <h4>PATIENT TYPE</h4>
              <select value={age} onChange={(e)=>setage(e.target.value)} >
                <option value={''}>SELECT GROUP</option>
                <option value={'new'}>NEW BORN</option>
                <option value={'under'}>UNDER FIVE</option>
                <option value={'child'}>CHILDREN</option>
                <option value={'adolescence'}>ADOLESCENCE</option>
                <option value={'adult'}>ADULT</option>
                <option value={'middle'}>MIDDLE AGE</option>
                <option value={'elder'}>ELDERLY</option>
              </select>
            </div>

            <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
              <h4>PATIENT STATUS</h4>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
               >
                <option value={''}>SELECT GROUP</option>
                <option value={'outpatient'}>OUTPATIENT</option>
                <option value={'admitted'}>INPATIENT</option>
                <option value={'emergency'}>EMERGENCY</option>
              </select>
            </div>
            
            <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
              <h4>CHOOSE SEX</h4>
              <select onChange={(e)=> setsex(e.target.value)} >
                  <option value={''}>ALL</option>
                  <option value={'male'} >MALE</option>
                  <option value={'female'}>FEMALE </option>
              </select>
            </div>
          </div>


          
          <div className='patient_details_input_field1_in_'>
              <div className='patient_details_input_field1_'>
                  <h4>CHOOSE DAY</h4>

                  <input
                      type="date"
                      value={selectedDay}
                      onChange={handleDailyReport}
                  />

              </div>
              <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                  <h4>CHOOSE MONTH</h4>
                  <select value={mnth} onChange={handlePeriodByMonth} >
                      <option value={1}>SELECT MONTH</option>
                      <option value={1}>JANUARY</option>
                      <option value={2}>FEBUARY</option>
                      <option value={3}>MARCH</option>
                      <option value={4}>APRIL</option>
                      <option value={5}>MAY</option>
                      <option value={6}>JUNE</option>
                      <option value={7}>JULY</option>
                      <option value={8}>AUGUST</option>
                      <option value={9}>SEPTEMBER</option>
                      <option value={10}>OCTOBER</option>
                      <option value={11}>NOVEMBER</option>
                      <option value={12}>DECEMBER</option>
                  </select>
              </div>
              
              <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                  <h4>CHOOSE YEAR</h4>
                  <select onChange={handlePeriodByyEAR} >
                      <option>CHOOSE YEAR</option>
                          {years?.map((year) => (
                          <option key={year} value={year}>
                          {year}
                          </option>
                      ))}
                  </select>
              </div>
              


              
          </div>
        </div>

        <div id='pdf-content' style={{padding:'10px'}} >
          <h3>OFM MEDICAL CENTER</h3>
          
          <table className='custome_table'>
              <thead>
                  <tr>
                      <th>DATE | TIME</th>
                      <th>SEX</th>
                      <th>AGE</th>
                      <th>STATUS</th>
                      <th>PATIENT NAME</th>
                      <th>ADDRESS</th>
                  </tr>
              </thead>
              { getPatient?.length > 0 &&
                getPatient?.map((item, i)=>{

                    const date = new Date(Number(item?.timeStamp))
                    const day = date.getDate() 
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    const date1 = new Date(Number(item?.timeStamp))

                    let hours = date1.getHours()
                    const minutes = date1.getMinutes()
                    const ampm = hours >= 12 ? "PM" : "AM"

                    hours = hours % 12
                    hours = hours ? hours : 12

                    const pad = (n) => n.toString().padStart(2, '0')

                    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                    return(
                        <tbody key={i}>
                            <tr>
                                <td><p>{timeString}, {`${day}-${month}-${year}`}</p></td>
                                <td><p>{item?.sex}</p></td>
                                <td><p>{item?.age} {item?.AgeType}</p></td>
                                <td><p>{item?.status === 'admitted' ? "inpatient" : item?.status}</p></td>
                                <td><p>{item?.name}</p></td>
                                <td><p>{item?.address}</p></td>
                            </tr>
                        </tbody>
                    )
                })
            }
          </table>
        </div>
      </div>
    </div>
  )
}

export default PatientStatistics