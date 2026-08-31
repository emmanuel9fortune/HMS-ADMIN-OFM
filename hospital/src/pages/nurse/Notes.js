import React, { useEffect, useState } from 'react'
import NurseBar from '../../components/NurseBar'
import { useDispatch, useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import { setreloads } from '../../features/reloadSlice'
import { selectip } from '../../features/ipSlice'

function Notes() {
  //axios.defaults.withCredentials = true
  const ip = useSelector(selectip)

  const info = useSelector(selectinfo)

  const [notes, setnotes] = useState(info?.notes || '')
  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)

  const dispatch = useDispatch()
  
  useEffect(()=>{
    setnotes(info?.notes || '')
  },[info])

  const handleSave=async()=>{
    try {
      await axios.post(`http://${'localhost'}:7700/addnote`, {uid: getid?._id, notes}).then((res)=>{        
        if(res.data.status === 'success'){
          toast.success('Note Saved')
          
          dispatch(
            setreloads(Date.now())
          )
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const ischnaged = info?.notes !== notes
  

  return (
    <div className='dashboard_container'>
        <NurseBar/>
        
        <div className='dashboard_body' >
          <div className='payment_desk' >
            <div className='note_container'>
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
  )
}

export default Notes