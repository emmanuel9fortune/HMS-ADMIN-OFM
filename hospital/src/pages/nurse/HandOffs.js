import React, { useEffect, useState } from 'react'
import NurseBar from '../../components/NurseBar'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import axios from 'axios'
import NurseCard from './NurseCard'
import { toast } from 'react-toastify'

function HandOffs() {
  const ip = useSelector(selectip)

  const [patient, setpatient] = useState('')
  const [notes, setnotes] = useState('')
  const [originalnotes, setoriginalnotes] = useState('')
  
  useEffect(()=>{
    const func =async()=>{
        try {
            await axios.post(`http://${'localhost'}:7700/GetHandOff`).then((res)=>{
                //console.log(res);
                if(res.data.status === 'success'){
                    setpatient(res.data.getpatients)
                    setoriginalnotes(res.data.getHandOFf.note)
                    setnotes(res.data.getHandOFf.note || '')
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    func()
  },[ip])

  const nurse = true

  const ischnaged = notes !== originalnotes
  
    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)

    const handleSave=async()=>{
      try {
        await axios.post(`http://${'localhost'}:7700/AddHandOff`, {staffID: getid?._id, notes}).then((res)=>{        
          if(res.data.status === 'success'){
            toast.success('Note Saved')
          }
        })
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <div className='dashboard_container'>
      <NurseBar/>
        
      <div className='dashboard_body' >
        <div className='patient_details_ labdash' >
          <div className='patient_details_input_field1' >
            <h3>PATIENTS UNDER GOING TREATMENTS</h3>

            {
              patient?.length > 0 ?
                  patient?.map((item, i)=>{ 
                  return(
                  <NurseCard key={i} item={item} nurse={nurse} />
                  )})
              : null
            }
          </div>      
              
          <div className='patient_details_input_field1' style={{height:'85vh'}} >
            <div className='note_container' style={{height:'100%'}} >
              <textarea value={notes} onChange={(e)=>setnotes(e.target.value)} placeholder='Enter Your Notes Here' />
              <div >
                <div></div>
                {
                  ischnaged && notes !== '' ?
                    <button onClick={handleSave} >SAVE</button>
                  :
                <button disabled style={{backgroundColor:'#c3c3c3'}} >SAVE</button>
                }
              </div>
            </div>
          </div>      
        </div>
        
      </div>
    </div>
  )
}

export default HandOffs