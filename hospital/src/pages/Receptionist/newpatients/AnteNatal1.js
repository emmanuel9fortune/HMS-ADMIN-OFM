import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectpatient } from '../../../features/patientSlice'
import { toast } from 'react-toastify';
import { selectip } from '../../../features/ipSlice'

function AnteNatal1({handleNext, setcurrentIndex, reload, setreload}) {
    const staffID = sessionStorage.getItem('staffID')
        const ip = useSelector(selectip)

    const getDep = JSON.parse(staffID)

    //axios.defaults.withCredentials = true
    const patient = useSelector(selectpatient)
    
    const [name, setname] = useState(patient?.name || '')
    const [religion, setreligion] = useState(patient?.religion || '')
    const [address, setaddress] = useState(patient?.address || '')
    const [specialPoints, setspecialPoints] = useState(patient?.specialPoints || '')
    const [dateOfBirth, setdateOfBirth] = useState(patient?.dateOfBirth || '')
    const [sect, setsect] = useState(patient?.sect || '')
    const [tribe, settribe] = useState(patient?.tribe || '')
    const [spousePhone, setspousePhone] = useState(patient?.spousePhone || '')
    const [nextOfKinAddress, setnextOfKinAddress] = useState(patient?.nextOfKinAddress || '')
    const [nextOfKin, setnextOfKin] = useState(patient?.nextOfKin || '')
    const [age, setage] = useState(patient?.age || '')
    const [nextOfKinPhone, setnextOfKinPhone] = useState(patient?.nextOfKinPhone || '')
    const [center, setcenter] = useState(patient?.center || '')
    const [dateOfBooking, setdateOfBooking] = useState(patient?.dateOfBooking || '')
    const [occupation, setoccupation] = useState(patient?.occupation || '')
    const [educationLevel, seteducationLevel] = useState(patient?.educationLevel || '')
    const [maritalStatus, setmaritalStatus] = useState(patient?.maritalStatus || '')
    const [ageAtMarriage, setageAtMarriage] = useState(patient?.ageAtMarriage || '')
    const [LMP, setLMP] = useState(patient?.LMP || '')
    const [eddByUss, seteddByUss] = useState(patient?.eddByUss || '')
    const [eddDate, seteddDate] = useState(patient?.eddDate || '')
    const [AverageMonthlyFamilyIncome, setAverageMonthlyFamilyIncome] = useState(patient?.AverageMonthlyFamilyIncome || '')

    const uid = sessionStorage.getItem('patient')

    // console.log(patient);
    

    const handleSubmit =async()=>{
        const value ={
            name,
            address,
            religion,
            dateOfBirth,
            nextOfKin,
            age,
            nextOfKinPhone,
            staffID: getDep?._id,
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
            uid
        }
        try {
            await axios.post(`http://${'localhost'}:7700/addPatient`, value).then((res)=>{                
                if(res.data.status === 'success'){
                    if(!uid){
                        sessionStorage.setItem('patient', res.data.user?._id)
                    }
                    setreload(reload + 1)
                    handleNext()
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <>
      <div className='patient_details_' >
        <div className='patient_details_input_field1' >
            <div className='patient_details_input_field1_' >
                <h4>PATIENT NAME</h4>
                <input placeholder='Enter Patient Name' value={name} onChange={(e)=>setname(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>CENTER</h4>
                <input placeholder='Enter center' value={center} onChange={(e)=>setcenter(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>SPECIAL POINTS</h4>
                <input placeholder='Enter special Point' value={specialPoints} onChange={(e)=>setspecialPoints(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>ADDRESS</h4>
                <input value={address} onChange={(e)=>setaddress(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_'>
                <h4>RELIGION</h4>
                <select value={religion} onChange={(e)=> setreligion(e.target.value)} >
                    <option >Select Religion</option>
                    <option value={'christian'} >Christian</option>
                    <option value={'islam'}>Islam</option>
                    <option value={'other'}>Other</option>
                </select>
            </div>
            <div className='patient_details_input_field1_' >
                <h4>SECT</h4>
                <input value={sect} onChange={(e)=>setsect(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>DATE OF BIRTH</h4>
                <input type='date' value={dateOfBirth} onChange={(e)=>setdateOfBirth(e.target.value)} />
            </div>
            
            <div className='patient_details_input_field1_in_'>
                <div className='patient_details_input_field1_in' >
                    <h4>AGE</h4>
                    <input type='number' value={age} onChange={(e)=>setage(e.target.value)} />
                </div>
                <div className='patient_details_input_field1_in' >
                    <h4>TRIBE</h4>
                    <input value={tribe} onChange={(e)=>settribe(e.target.value)} />
                </div>
            </div>

            <div className='patient_details_input_field1_' >
                <h4>SPOUSE PHONE NUMBER</h4>
                <input type='number' value={spousePhone} onChange={(e)=>setspousePhone(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>NEXT OF KIN</h4>
                <input value={nextOfKin} onChange={(e)=>setnextOfKin(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>NEXT OF KIN'S PHONE</h4>
                <input value={nextOfKinPhone} onChange={(e)=>setnextOfKinPhone(e.target.value)} />
            </div>
        </div>
        
        <div className='patient_details_input_field1'>
            <div className='patient_details_input_field1_' >
                <h4>NEXT OF KIN'S ADDRESS</h4>
                <input value={nextOfKinAddress} onChange={(e)=>setnextOfKinAddress(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>DATE OF BOOKING</h4>
                <input type='date' value={dateOfBooking} onChange={(e)=>setdateOfBooking(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>OCCUPATION</h4>
                <input value={occupation} onChange={(e)=>setoccupation(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>LEVEL OF EDUCATION</h4>
                <input value={educationLevel} onChange={(e)=>seteducationLevel(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>MARITA STATUS</h4>
                <select value={maritalStatus} onChange={(e)=>setmaritalStatus(e.target.value)}>
                    <option>Select Marital status</option>
                    <option value={'married'}>Married</option>
                    <option value={'divorce'}>Divorce</option>
                    <option value={'single'}>Single</option>
                    <option value={'widow'}>Widow</option>
                </select>
            </div>
            <div className='patient_details_input_field1_' >
                <h4>AGE AT MARRIAGE</h4>
                <input value={ageAtMarriage} onChange={(e)=>setageAtMarriage(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>L.M.P</h4>
                <input value={LMP} onChange={(e)=>setLMP(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>EDD BY USS</h4>
                <input value={eddByUss} onChange={(e)=>seteddByUss(e.target.value)} />
            </div>

            <div className='patient_details_input_field1_' >
                <h4>EDD DATE</h4>
                <input type='date' value={eddDate} onChange={(e)=>seteddDate(e.target.value)} />
            </div>
            <div className='patient_details_input_field1_' >
                <h4>AVERAGE MONTHLY FAMILY INCOME</h4>
                <input value={AverageMonthlyFamilyIncome} onChange={(e)=>setAverageMonthlyFamilyIncome(e.target.value)} />
            </div>
        </div>
      </div>

      
      <div className='custome_table_btn' >
          <div className='back_btn_' onClick={()=>setcurrentIndex(0)}>
              <FaChevronLeft />
              <h4>BACK</h4>
          </div>
            {
                name !== '' ?  
                    <button onClick={handleSubmit} className='custome_table_btn2' >SUBMIT</button>
                :
                <button style={{opacity:'.3px'}} onClick={()=>toast.error('PLEASE ENTER PATIENT NAME')} className='custome_table_btn2' >SUBMIT</button>
            }
      </div>
    </> 
  )
}

export default AnteNatal1