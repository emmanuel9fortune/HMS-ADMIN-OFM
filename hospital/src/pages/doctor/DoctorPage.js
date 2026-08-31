import React, { useEffect } from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setinfos } from '../../features/infoSlice'
import { selectip } from '../../features/ipSlice'
import Paymentdesk from './Paymentdesk'
import Task from './Task'
import Notes from './Note'

function DoctorPage() {

  //axios.defaults.withCredentials = true
      const ip = useSelector(selectip)

  const reload = useSelector((state) => state.reload.reload);
  const staffID = sessionStorage.getItem('staffID')
  const getid = JSON.parse(staffID)

  const token = sessionStorage.getItem('refreshToken')


  const dispatch = useDispatch()

  useEffect(()=>{
    const func =async()=>{
      try {
        await axios.post(`http://${'localhost'}:7700/doctorDashboard`, {staffID: getid?._id, token}).then((res)=>{
          //console.log(res);
          
          if(res.data.status === 'success'){ 
            dispatch(
              setinfos({
                getNotification: res.data?.getNotification,
                getPatientDetails: res.data?.getPatientDetails,
                notes: res.data?.getnotes?.notes,
                task: res.data?.gettask,
              })
            )
            const accessToken = res.data.accessToken
            sessionStorage.setItem('accessToken', accessToken);
          }
        })
      } catch (error) {
        console.log(error);
      }
    }
    func()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch, reload])

  return (
        <Router>
          <Routes>
              <Route path='/' element={<Dashboard/>} />
              <Route path='/paymentdesk' element={<Paymentdesk/>} />
              <Route path='/tasks' element={<Task/>} />
              <Route path='/notes' element={<Notes/>} />
          </Routes>
        </Router>
  )
}

export default DoctorPage