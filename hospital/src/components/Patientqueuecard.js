import axios from 'axios';
import React from 'react'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'
import { selectip } from '../features/ipSlice'

function Patientqueuecard({patient, setreload, reload}) {
    const ip = useSelector(selectip)

  const handleRemove =async()=>{
    try {
      await axios.post(`http://localhost:7700/deleteQueue`, {uid: patient?._id}).then((res)=>{
        if(res.data.status === 'success'){
          toast.success('PATIENT REMOVED FROM QUEUE')
          setreload(reload + 1)
        }else{
          toast.warning('PATIENT ALREADY ADDED TO QUEUE')
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc'>
            <h4>{patient?.name}</h4>
            <p>{patient?.center ? 'Ante Natal Patient' : 'Regular Patient'}</p>
        </div>

        <div className='Patientqueuecard_button'>
            <button onClick={handleRemove} >Remove</button>
        </div>
    </div>
  )
}

export default Patientqueuecard;