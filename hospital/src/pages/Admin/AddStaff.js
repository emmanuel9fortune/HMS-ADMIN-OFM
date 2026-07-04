import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import { FaImage } from 'react-icons/fa'
import { toast } from 'react-toastify'

function AddStaff() {

  //axios.defaults.withCredentials = true
  const [staffs, setstaffs] = useState([])
  const [reload, setreload] = useState(0)
  const cip = window.location.hostname

  useEffect(()=>{
    const controller = new AbortController()
    const func =async()=>{
      try {
        await axios.post(`http://${cip || 'localhost'}:7700/getStaffs`, {signal: controller.signal }).then((res)=>{
          if(res.data.status === 'success'){
            
            setstaffs(res.data.staffs)
            setreload(0)
          }
        })
      } catch (error) {
        console.log(error);
      }
    }
    func()
    return ()=> controller.abort()
  },[reload, cip])
  
  console.log(staffs);

  const handleDelete =async(id)=>{
    try {
      await axios.post(`http://${cip || 'localhost'}:7700/deleteStaff`, {staffID: id}).then((res)=>{
        if(res.data.status === 'success'){
          setreload(reload + 1)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  
  const [img, setimg] = useState(null)
  const [name, setname] = useState('')
  const [title, settitle] = useState('')
  const [passkey, setpasskey] = useState('')
  const [dob, setdob] = useState('')
  const [address, setaddress] = useState('')
  const [phone, setphone] = useState('')
  const [nextOfKin, setnextOfKin] = useState('')
  const [nextOfKinPhone, setnextOfKinPhone] = useState('')
  const [email, setemail] = useState('')
  const [state, setstate] = useState('')
  const [lga, setlga] = useState('')
  const [nationality, setnationality] = useState('')
  const [qualifications, setqualifications] = useState('')
  const [referees, setreferees] = useState('')

  const handleAddStaff =async()=>{
    if(!img && name !== '' && title !== '' && passkey !== '') return alert('Enter All Fields Remember To Include an Image')

    const formdata = new FormData();
    formdata.append('img', img)

    const value ={
      name,
      title,
      passkey,
      dob,
      address,
      phone,
      nextOfKin,
      nextOfKinPhone,
      email,
      state,
      lga,
      nationality,
      qualifications,
      referees,
    }

    let serialString = JSON.stringify(value);
    formdata.append('value', serialString)

    try {
      await axios.post(`http://${cip || 'localhost'}:7700/createStaff`, formdata).then((res)=>{
        if(res.data.status === 'success'){
          setreload(reload + 1)
          setimg(null)
          setname('')
          settitle('')
          setpasskey('')
          setdob('')
          setaddress('')
          setphone('')
          setnextOfKin('')
          setnextOfKinPhone('')
          setemail('')
          setstate('')
          setlga('')
          setnationality('')
          setqualifications('')
          setreferees('')
  }else{
          alert(res.data.message)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  
    const [edit, setedit] = useState(false)
    const [sname, setsname] = useState('')
    const [dep, setdep] = useState('')
    const [pass, setpass] = useState('')
    const [id, setid] = useState('')
    const [edob, setedob] = useState('')
    const [eaddress, seteaddress] = useState('')
    const [ephone, setephone] = useState('')
    const [enextOfKin, setenextOfKin] = useState('')
    const [enextOfKinPhone, setenextOfKinPhone] = useState('')
    const [eemail, seteemail] = useState('')
    const [estate, setestate] = useState('')
    const [elga, setelga] = useState('')
    const [enationality, setenationality] = useState('')
    const [equalifications, setequalifications] = useState('')
    const [ereferees, setereferees] = useState('')

    const handleSave =async()=>{
      try {
        await axios.post(`http://${cip || 'localhost'}:7700/editStaff`,
          {
            sname, 
            dep, 
            pass, 
            id,
            edob,
            eaddress,
            ephone,
            enextOfKin,
            enextOfKinPhone,
            eemail,
            estate,
            elga,
            enationality,
            equalifications,
            ereferees,
          }
        ).then((res)=>{
          if(res.data.status === 'success'){
            toast.success('Edit saved')
            setreload(reload + 1)
          }
        })
      } catch (error) {
        console.log(error)
      }
    } 

    
  
  return (
    <div className='dashboard_container'>
      <AdminBar/> 

      <div className='dashboard_body' >
        <div className='payment_desk' >
          <h3>ADD STAFF</h3> 

          <div className='add_staff_contaimer'>
            <input type='file' onChange={(e)=>setimg(e.target.files[0])} id='files' style={{display:'none'}} />
            <label htmlFor='files' >
              {
                !img ?
                <FaImage size={150} color='#c3c3c3' />
                :
                <img src={URL.createObjectURL(img)} alt='' />
              }
            </label>
              {
                !img ?
                  <p>Choose staff Photo</p>
                :
                  <p>Click to change Photo</p>
              }

            <div className='patient_details_input_field1_' >
                <h4>STAFF NAME</h4>
                <input placeholder='Staff Name' value={name} onChange={(e)=>setname(e.target.value)} />
            </div>

            
            <div className='patient_details_input_field1_in_'>
              <div className='patient_details_input_field1_in' >
                  <h4>DEPARTMENT</h4>
                  <select style={{padding:'20px'}} value={title} onChange={(e)=>settitle(e.target.value)} >
                    <option>Select Department</option>
                    <option value={'receptionist'} >Receptionist</option>
                    <option value={'cashier'} >Cashier</option>
                    <option value={'nurse'} >Nurse</option>
                    <option value={'doctor'} >Doctor</option>
                    <option value={'pharmacy'} >Pharmacy</option>
                    <option value={'laboratory'} >Lab Scientist</option>
                  </select>
              </div>

                <div className='patient_details_input_field1_in' >
                    <h4>DATE OF BIRTH</h4>
                    <input type='date' value={dob} onChange={(e)=>setdob(e.target.value)} />
                </div>
            </div>

            
            <div className='patient_details_input_field1_in_'>
              <div className='patient_details_input_field1_in' >
                  <h4>PHONE NUMBER</h4>
                    <input type='tel' placeholder='Enter Phone Number' value={phone} onChange={(e)=>setphone(e.target.value)} />
              </div>

              <div className='patient_details_input_field1_in' >
                  <h4>EMAIL ADDRESS</h4>
                  <input type='email' placeholder='Enter Email Address' value={email} onChange={(e)=>setemail(e.target.value)} />
              </div>

            </div>
            
            <div className='patient_details_input_field1_in_'>
              <div className='patient_details_input_field1_in' >
                  <h4>STATE OF ORIGIN</h4>
                  <input placeholder='Enter State of origin' value={state} onChange={(e)=>setstate(e.target.value)} />
              </div>

              <div className='patient_details_input_field1_in' >
                  <h4>LGA</h4>
                  <input placeholder='Enter LGA' value={lga} onChange={(e)=>setlga(e.target.value)} />
              </div>
            </div>
            
            <div className='patient_details_input_field1_in_'>
              <div className='patient_details_input_field1_in' >
                  <h4>NATIONALITY</h4>
                  <input placeholder='Enter Nationality' value={nationality} onChange={(e)=>setnationality(e.target.value)} />
              </div>

              <div className='patient_details_input_field1_in' >
                  <h4>QUALIFICATION</h4>
                  <input type='text' placeholder='Enter Qualifications' value={qualifications} onChange={(e)=>setqualifications(e.target.value)} />
              </div>
            </div>
            
            <div className='patient_details_input_field1_in_'>
              <div className='patient_details_input_field1_in' >
                  <h4>KIN NAME</h4>
                  <input placeholder='Enter Kin Name' value={nextOfKin} onChange={(e)=>setnextOfKin(e.target.value)} />
              </div>

              <div className='patient_details_input_field1_in' >
                  <h4>KIN PHONE NUMBER</h4>
                  <input type='text' placeholder='Enter Kin Number' value={nextOfKinPhone} onChange={(e)=>setnextOfKinPhone(e.target.value)} />
              </div>
            </div>


            <div className='patient_details_input_field1_' >
                <h4>STAFF HOME ADDRESS</h4>
                <input placeholder='Enter Home Address' value={address} onChange={(e)=>setaddress(e.target.value)} />
            </div>
            
            <div className='patient_details_input_field1_in_'>
              <div className='patient_details_input_field1_in' >
                  <h4>REFEREE/GUARANTOR</h4>
                  <input placeholder='Enter Refree/Guarantor' value={referees} onChange={(e)=>setreferees(e.target.value)} />
              </div>

              <div className='patient_details_input_field1_in' >
                  <h4>PASSKEY</h4>
                  <input placeholder='Enter Staff Passkey' value={passkey} onChange={(e)=>setpasskey(e.target.value)} />
              </div>
            </div>


            <button className='add_staff_contaimer_button' onClick={handleAddStaff}>UPLOAD STAFF DETAILS</button>
          </div>

          
            <div className='payment_desk_cart_fields' >
              <h3>ALL STAFFS</h3>
              <div className='display_all_utilities' style={{position:'relative'}}>
                {
                  staffs?.length > 0 ?
                    staffs?.map((staff, i)=>(
                    <div key={i} >
                      <img src={`http://${cip || 'localhost'}:7700/uploads/staffs/${staff?.photo}`} alt='' />
                      <div>
                        <p>{staff?.name}</p>
                        <h4>{staff?.title}</h4>
                        <h4>{staff?.passkey}</h4>
                      </div>
                      <div style={{display:'flex', flexDirection:'column'}} >
                        <button onClick={()=>handleDelete(staff?._id)} style={{margin:'10px 0'}} >DELETE</button>
                        <button 
                          onClick={()=>{
                            setedit(true); 
                            setsname(staff?.name); 
                            setdep(staff?.title); 
                            setpass(staff?.passkey); 
                            setid(staff?._id);
                            setedob(staff?.dob);
                            seteaddress(staff?.address);
                            setephone(staff?.phone);
                            setenextOfKin(staff?.nextOfKin);
                            setenextOfKinPhone(staff?.nextOfKinPhone);
                            seteemail(staff?.email);
                            setestate(staff?.state);
                            setelga(staff?.lga);
                            setenationality(staff?.nationality);
                            setequalifications(staff?.qualifications);
                            setereferees(staff?.referees);
                            }}>EDIT</button>
                      </div>
                    </div>
                    ))
                  : null
                }
                
                
              </div>
            </div>

            {
              edit &&
              <div style={{position:'absolute', width:'700px', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding: '20px'}}>
                <h3>EDIT STAFF INFO</h3>
                <div className='patient_details_input_field1_' style={{width:'100%'}} >
                  <h4>STAFF NAME</h4>
                  <input type='text' placeholder='Staff Name' value={sname} onChange={(e)=>setsname(e.target.value)} />
                </div>

                
                <div className='patient_details_input_field1_in_'>
                  <div className='patient_details_input_field1_in' >
                      <h4>DEPARTMENT</h4>
                      <select style={{padding:'20px'}} value={dep} onChange={(e)=>setdep(e.target.value)} >
                        <option>Select Department</option>
                        <option value={'receptionist'} >Receptionist</option>
                        <option value={'cashier'} >Cashier</option>
                        <option value={'nurse'} >Nurse</option>
                        <option value={'doctor'} >Doctor</option>
                        <option value={'pharmacy'} >Pharmacy</option>
                        <option value={'laboratory'} >Lab Scientist</option>
                      </select>
                  </div>

                    <div className='patient_details_input_field1_in' >
                        <h4>DATE OF BIRTH</h4>
                        <input type='date' value={edob} onChange={(e)=>setedob(e.target.value)} />
                    </div>
                </div>

            
                <div className='patient_details_input_field1_in_'>
                  <div className='patient_details_input_field1_in' >
                      <h4>PHONE NUMBER</h4>
                        <input type='tel' placeholder='Enter Phone Number' value={ephone} onChange={(e)=>setephone(e.target.value)} />
                  </div>

                  <div className='patient_details_input_field1_in' >
                      <h4>EMAIL ADDRESS</h4>
                      <input type='email' placeholder='Enter Email Address' value={eemail} onChange={(e)=>seteemail(e.target.value)} />
                  </div>

                </div>
            
                <div className='patient_details_input_field1_in_'>
                  <div className='patient_details_input_field1_in' >
                      <h4>STATE OF ORIGIN</h4>
                      <input placeholder='Enter State of origin' value={estate} onChange={(e)=>setestate(e.target.value)} />
                  </div>

                  <div className='patient_details_input_field1_in' >
                      <h4>LGA</h4>
                      <input placeholder='Enter LGA' value={elga} onChange={(e)=>setelga(e.target.value)} />
                  </div>
                </div>
            
                <div className='patient_details_input_field1_in_'>
                  <div className='patient_details_input_field1_in' >
                      <h4>NATIONALITY</h4>
                      <input placeholder='Enter Nationality' value={enationality} onChange={(e)=>setenationality(e.target.value)} />
                  </div>

                  <div className='patient_details_input_field1_in' >
                      <h4>QUALIFICATION</h4>
                      <input type='text' placeholder='Enter Qualifications' value={equalifications} onChange={(e)=>setequalifications(e.target.value)} />
                  </div>
                </div>
                
                <div className='patient_details_input_field1_in_'>
                  <div className='patient_details_input_field1_in' >
                      <h4>KIN NAME</h4>
                      <input placeholder='Enter Kin Name' value={enextOfKin} onChange={(e)=>setenextOfKin(e.target.value)} />
                  </div>

                  <div className='patient_details_input_field1_in' >
                      <h4>KIN PHONE NUMBER</h4>
                      <input type='text' placeholder='Enter Kin Number' value={enextOfKinPhone} onChange={(e)=>setenextOfKinPhone(e.target.value)} />
                  </div>
                </div>


                <div className='patient_details_input_field1_' >
                    <h4>STAFF HOME ADDRESS</h4>
                    <input placeholder='Enter Home Address' value={eaddress} onChange={(e)=>seteaddress(e.target.value)} />
                </div>
                
                <div className='patient_details_input_field1_in_'>
                  <div className='patient_details_input_field1_in' >
                      <h4>REFEREE/GUARANTOR</h4>
                      <input placeholder='Enter Refree/Guarantor' value={ereferees} onChange={(e)=>setereferees(e.target.value)} />
                  </div>

                  <div className='patient_details_input_field1_in' >
                      <h4>PASSKEY</h4>
                      <input placeholder='Enter Staff Passkey' value={pass} onChange={(e)=>setpass(e.target.value)} />
                  </div>
                </div>

                <button className='add_staff_contaimer_button' onClick={handleSave}>SAVE EDIT</button>
                <button className='add_staff_contaimer_button' onClick={()=>setedit(false)} style={{color:'blue', background:'Whitesmoke'}}>CANCEL EDIT</button>

              </div>
            }
        </div>
      </div>
    </div>
  )
}

export default AddStaff