import React, { useState } from 'react';
import '../pages/Allstyling.css';
import { FaColumns } from 'react-icons/fa';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'
import { selectip } from '../features/ipSlice'
import { useDispatch } from 'react-redux'
import { setreloads } from '../features/reloadSlice'

function Recentpatientdashcard({res}) {

    const ip = useSelector(selectip)
    const date = new Date(Number(res?.timeStamp))
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const date1 = new Date(Number(res?.timeStamp))

    let hours = date1.getHours()
    const minutes = date1.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12

    const pad = (n) => n.toString().padStart(2, '0')

    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

    const [option, setoption] = useState(false)
    const dispatch = useDispatch()

    const handleUpdateStatus1 =async()=>{
      const status = false
      try{
        await axios.post(`http://localhost:7700/updatePatientStatus`, {uid: res?._id , status}).then((res)=>{
          if(res.data.status === 'success'){
            setoption(false)
            toast.success('PATIENT STATUS UPDATED')
            dispatch(setreloads({ msg: 'PATIENT STATUS UPDATED'}));
          }
        })
      }catch(error){
        console.log(error)
      }
    }

  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc'>
            <h4 className='recentpatientdashcard_name'>{res?.name}</h4>
            <p className='recentpatientdashcard_phoneNo'>{res?.center ? "Ante Natal Patient" : "Regular Patient"}</p>
        </div>

        <div className='recentpatientdashcard_desc' style={{display:'flex', flexDirection:'column', alignItems:'flex-end', margin:'0 20px'}}>
            <p className='recentpatientdashcard_date'>{res?.status}</p>
            <p className='recentpatientdashcard_time'>{timeString}, {`${day}-${month}-${year}`}</p>
        </div>

        <div onClick={()=>setoption(true)} className='card_icon_' >
          <FaColumns size={22} />
        </div>

        {
          option &&
          <div onClick={()=>setoption(false)} className='card_option_overlay' ></div>
        }

        {
          option &&
          <div className='card_option' >
            <div onClick={handleUpdateStatus1}>
              <h4  style={{color:'green'}} >Discharged</h4>
            </div>
          </div>
        }
    </div>
  )
}

export default Recentpatientdashcard;