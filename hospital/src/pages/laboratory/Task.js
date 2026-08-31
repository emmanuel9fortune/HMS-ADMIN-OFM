import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import { setreloads } from '../../features/reloadSlice'
import { selectip } from '../../features/ipSlice'
import LabBar from '../../components/LabBar'

function Task() {
  
  //axios.defaults.withCredentials = true
      const ip = useSelector(selectip)
  
  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)
  const info = useSelector(selectinfo)
  
  const [task, settask] = useState('')
  
  const dispatch = useDispatch()

  const addTask =async()=>{
    const tasks={
      title: task,
      timeStamp : new Date().getTime()
    }
    try {
      await axios.post(`http://${'localhost'}:7700/addtask`, {tasks, uid: getid?._id}).then((res)=>{
        if(res.data.status === 'success'){
          toast.success('TASK ADDED')
          dispatch(
            setreloads(Date.now())
          )
          settask('')
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

    const handleUpdateTask =async(ids)=>{
        try {
        await axios.post(`http://${'localhost'}:7700/updatetask`, {taskId: ids, uid: getid?._id }).then((res)=>{
            if(res.data.status === 'success'){
              dispatch(
                setreloads(Date.now())
              )
            }
        })
        } catch (error) {
        console.log(error);
        }
    }
    

  return (
    <div className='dashboard_container'>
        <LabBar/>
        
        <div className='dashboard_body' >
          <h1>Tasks</h1>
                               

          <div className='patient_details_ labdash' >
            <div className='patient_details_input_field1' >
              <div className='payment_desk_input' >
                <h4>ENTER TASK</h4>
                <input placeholder='Enter Task Description' value={task} onChange={(e)=>settask(e.target.value)} />
              </div>
              <div className='payment_desk_input_fields_btn'>
                <button onClick={addTask} className='payment_desk_input_fields_btn2'>SUBMIT</button>
              </div>
            </div>
            <div className='patient_details_input_field1' >
              <h4>All Tasks</h4>
              <div className='task_bar' >
                  {
                      info?.task?.length > 0 ?
                          info?.task?.map((item, i)=>{                   
                              const date = new Date(Number(item?.timeStamp))
                              const day = date.getDate()
                              const month = date.getMonth()
                              const year = date.getFullYear()

                              let hours = date.getHours()
                              const minutes = date.getMinutes()
                              const ampm = hours >= 12 ? "PM" : "AM"

                              hours = hours % 12
                              hours = hours ? hours : 12

                              const pad = (n) => n.toString().padStart(2, '0')

                              const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                              return(
                          <div key={i} className='recentpatientdashcard'>
                              <div className='recentpatientdashcard_desc'>
                                  <h4>{item.title}</h4>
                                  <p>{timeString}, {`${day}-${month}-${year}`}</p>
                              </div>

                              <div className='Patientqueuecard_button'>
                                  {
                                      item?.status === 'completed' ?
                                  <button className='add_new_patient_container_btns2' style={{backgroundColor:'#c3c3c3'}} disabled>COMPLETED</button>
                                  :
                                  <button className='add_new_patient_container_btns2' onClick={()=>handleUpdateTask(item?._id)}>DONE</button>
                                  }
                              </div>
                          </div>
                          )})
                      : null
                  }
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Task