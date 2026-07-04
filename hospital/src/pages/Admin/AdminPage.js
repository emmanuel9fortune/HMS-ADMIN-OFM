import React, { useEffect } from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import AddStaff from './AddStaff'
import AddServices from './AddServices'
import AddUtils from './AddUtils'
import SearchDrugs from './SearchDrugs'
import SearchPatient from './SearchPatient'
import DrugDate from './DrugDate'
import TransactionHistory from './TransactionHistory'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setinfos } from '../../features/infoSlice'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import Roster from './Roster'
import Paymentdesk from './DeleteConsume'
import Lab from './Lab'
import Audit from './Audits'
import EditReceipt from './EditReceipt'
import DataAnalyst from './DataAnalyst'
import { ToastContainer } from 'react-toastify'


function AdminPage() {

  const dispatch = useDispatch()
    const ip = useSelector(selectip)
  const cip = window.location.hostname

  useEffect(()=>{
    const controller = new AbortController()
      const func =async()=>{
          try{
              await axios.post(`http://${cip || 'localhost'}:7700/Admdashboard`, {signal: controller.signal}).then((res)=>{
                console.log(res)
                if(res.data.status === 'success'){ 
                  dispatch(
                    setinfos({
                      invoice: res.data.TotalInvoice || 0,
                      numberOfPatients: res.data.getPatientCount || 0,
                      numberOfutils: res.data.getutilsCount || 0,
                      staffs: res.data.getSaff || 0,
                      stocksExpire: res.data.stocksExpire || 0,
                      batches : res.data.getBatches,
                      analytics : res.data.analytics[0],
                      utilsQty : res.data.utilsQty,
                    })
                  )
                }
              })
          }catch(error){
              console.log(error)
          }
      }
      func()
      return ()=> controller.abort()
  },[dispatch, ip])

  return (
    <Router>
      <ToastContainer/>
      <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/addstaff' element={<AddStaff/>} />
          <Route path='/addutils' element={<AddUtils/>} />
          <Route path='/searchdrugs' element={<SearchDrugs/>} />
          <Route path='/searchpatient' element={<SearchPatient/>} />
          <Route path='/drugdate' element={<DrugDate/>} /> 
          <Route path='/history' element={<TransactionHistory/>} />
          <Route path='/addservices' element={<AddServices/>} />
          <Route path='/deletecosumable' element={<Paymentdesk/>} />
          <Route path='/addroster' element={<Roster/>} />
          <Route path='/Laboratory' element={<Lab/>} />
          <Route path='/audit' element={<Audit/>} />
          <Route path='/editreceipt' element={<EditReceipt/>} />
          <Route path='/data_analyst' element={<DataAnalyst/>} />
      </Routes>
    </Router> 
  )
}

export default AdminPage