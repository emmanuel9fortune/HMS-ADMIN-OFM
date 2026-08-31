import axios from 'axios'
import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'
import { selectip } from '../../../features/ipSlice'

function RegularPatient({handlePrevious}) {
    //axios.defaults.withCredentials = true
            const ip = useSelector(selectip)

    const staffID = sessionStorage.getItem('staffID')

    const getDep = JSON.parse(staffID)

    const [name, setname] = useState('')
    const [address, setaddress] = useState('')
    const [notes, setnotes] = useState('')
    const [religion, setreligion] = useState('')
    const [hop, sethop] = useState('')
    const [dateOfBirth, setdateOfBirth] = useState('')
    const [sex, setsex] = useState('')
    const [nextOfKin, setnextOfKin] = useState('')
    const [age, setage] = useState('')
    const [phone, setphone] = useState('')
    const [nextOfKinPhone, setnextOfKinPhone] = useState('')

    const handleSubmit=async()=>{
        const value={
            name,
            address,
            notes,
            religion,
            hop,
            dateOfBirth,
            sex,
            nextOfKin,
            age,
            phone,
            nextOfKinPhone,
            staffID: getDep?._id
        }
        try {
            await axios.post(`http://${'localhost'}:7700/addPatient`, value).then((res)=>{
                if(res.data.status === 'success'){
                    toast.success('Upload Successfull')
                    setname('')
                    setaddress('')
                    setnotes('')
                    setreligion('')
                    sethop('')
                    setdateOfBirth('')
                    setsex('')
                    setnextOfKin('')
                    setage('')
                    setphone('')
                    setnextOfKinPhone('')
                    handlePrevious()
                    sessionStorage.removeItem('patient')
                    sessionStorage.removeItem('index')
                }else{
                    console.log(res.data);
                    
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    
  return (
    <>
        <h2 className='regular_patient_hd'>REGISTER NEW PATIENT</h2>

        <div className='patient_details_' >
            <div className='patient_details_input_field1' >
                <div className='patient_details_input_field1_'>
                    <h4>PATIENT NAME</h4>
                    <input value={name} onChange={(e)=> setname(e.target.value)} placeholder='Enter Patient Name' />
                </div>
                <div className='patient_details_input_field1_'>
                    <h4>ADDRESS</h4>
                    <input value={address} onChange={(e)=> setaddress(e.target.value)} placeholder='Enter Patient Address' />
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
                <div className='patient_details_input_field1_'>
                    <h4>HOD NO.</h4>
                    <input placeholder='Enter Hod Number' type='number'  value={hop} onChange={(e)=> sethop(e.target.value)}  />
                </div>
            </div>

            <div className='patient_details_input_field1' >
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_in' >
                        <h4>DATE OF BIRTH</h4>
                        <input  value={dateOfBirth} onChange={(e)=> setdateOfBirth(e.target.value)}  type='date'/>
                    </div>
                    <div className='patient_details_input_field1_in' >
                        <h4>AGE</h4>
                        <input type='number' placeholder='Enter Patient Age'  value={age} onChange={(e)=> setage(e.target.value)}  />
                    </div>
                </div>
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_in1' >
                        <div className='previouse_medicals_checkbox_text'>
                            <h4>SEX</h4>
                            <div>
                                <div>
                                    <p>Male</p>
                                    <input checked={sex === 'male' ? true : false} onChange={(e)=> setsex('male')}  type='checkbox' />
                                </div>
                                
                                <div>
                                    <p>Female</p>
                                    <input checked={sex === 'female' ? true : false} onChange={(e)=> setsex('female')} type='checkbox' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='patient_details_input_field1_in' >
                        <h4>PATIENT PHONE NUMBER</h4>
                        <input type='number' placeholder='Enter Patient Phone Number'  value={phone} onChange={(e)=> setphone(e.target.value)}  />
                    </div>
                </div>
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_in' >
                        <h4>NEXT OF KIN</h4>
                        <input placeholder='Enter Next Kin'  value={nextOfKin} onChange={(e)=> setnextOfKin(e.target.value)}  />
                    </div>
                    <div className='patient_details_input_field1_in' >
                        <h4>NEXT OF KIN PHONE NUMBER</h4>
                        <input type='number' placeholder='Enter Next of kin Phone Number'  value={nextOfKinPhone} onChange={(e)=> setnextOfKinPhone(e.target.value)}  />
                    </div>
                </div>
            </div>
        </div>

        
        <div className='previouse_medicals_textareas_NOTE' >
            <div >
                <h4>CLINICAL NOTES</h4>
                <textarea placeholder='Enter Clinical Notes'  value={notes} onChange={(e)=>setnotes(e.target.value)} />
            </div>
        </div>

        <div className='custome_table_btn' >
            <div className='back_btn_' onClick={handlePrevious}>
                <FaChevronLeft />
                <h4>BACK</h4>
            </div>

            {
                name ?
                    <button onClick={handleSubmit} className='custome_table_btn2' >SUBMIT</button>
                :
                <button style={{opacity:'.3px'}} onClick={()=>toast.error('PLEASE ENTER PATIENT NAME')} className='custome_table_btn2' >SUBMIT</button>
            }
        </div>
    </>
  )
}

export default RegularPatient