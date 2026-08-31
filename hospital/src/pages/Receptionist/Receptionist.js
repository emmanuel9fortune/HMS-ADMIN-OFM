import React from 'react'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Patientqueue from './Patientqueue'
import Newpatient from './Newpatient'
import Paymentdesk from './Paymentdesk'
import Searchpatient from './Searchpatient'
import TransactionHistory from './TransactionHistory'

function Receptionist() {

  //axios.defaults.withCredentials = true
  

  return (
    <Router>
      <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/patientqueue' element={<Patientqueue/>} />
          <Route path='/newpatient' element={<Newpatient/>} />
          <Route path='/paymentdesk' element={<Paymentdesk/>} />
          <Route path='/searchpatient' element={<Searchpatient />} />
          <Route path='/history' element={<TransactionHistory />} />
      </Routes>
    </Router>
  )
}

export default Receptionist