import React, { useEffect, useState } from 'react';
import SideBar from '../../components/SideBar';
import Patientqueuecard from '../../components/Patientqueuecard';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'

function Patientqueue() {

  //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)

  const [getPatient, setgetPatient] = useState([])
  const [reload, setreload] = useState(0)

  useEffect(()=>{
    const func =async()=>{
      try {
        await axios.post(`http://${'localhost'}:7700/getQueue`).then((res)=>{
          if(res.data.status === 'success'){
            setgetPatient(res.data.getpatients)
            setreload(0)
          }
        })
      } catch (error) {
        console.log(error);
        
      }
    }
    func()
  },[reload, ip])

  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body' >
          <h3>NEXT PATIENT</h3>
          
          <div className='Patientqueue_cards'>
            {
              getPatient?.length > 0 ?
                getPatient?.map((patient, i)=>(
                  <Patientqueuecard key={i} patient={patient} reload={reload} setreload={setreload} />
                ))
              : null
            }
          </div>
        </div>
    </div>
  )
}

export default Patientqueue;