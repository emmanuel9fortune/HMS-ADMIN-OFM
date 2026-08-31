import React from 'react'
import './sidebar.css'
import logo from '../img/logo.jpg'
import { FaCalendar, FaCreditCard, FaHistory, FaPills, FaPlus, FaReceipt, FaSearchPlus, FaStethoscope, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { MdEventNote } from 'react-icons/md';

function AdminBar() {

    const log = localStorage.getItem('log')
    const getvalues =JSON.parse(log)

    const handleLogOut =()=>{
        localStorage.setItem('log', JSON.stringify({key: getvalues?.key, set: false}))
        window.location.reload()
    }

  return (
      <div className='sidebar_container'>
          <div className='sidebar_logo'>
              <img src={logo} alt='' />
              <h3>O.F.M. Medical Centre</h3>
          </div>
  
          <Link to='/addstaff' style={{marginTop:'40px'}} className='sidebar_links'>
              <FaPlus size={17} color="#0463ca" />
              <p style={{color:'#0463ca'}} >ADD STAFF</p>
          </Link>
  
          <div className='sidebar_spacer' ></div> 
          
          <Link to='/' className='sidebar_links'>
              <p>DASHBOARD</p>
              <MdEventNote size={17} color="#555" />
          </Link>
          
          <Link  to='/addutils' className='sidebar_links'>
              <p>ADD DRUGS | CONSUMABLES </p>
              <FaStethoscope size={20} color="#555" />
          </Link>
          
          <Link  to='/addservices' className='sidebar_links'>
              <p>ADD SERVICES</p>
              <FaPlus size={20} color="#555" />
          </Link>
  
          <Link to='/searchpatient' className='sidebar_links'>
              <p>SEARCH PATIENT</p>
              <FaSearchPlus size={17} color="#555" />
          </Link>

          <Link to='/searchdrugs' className='sidebar_links'>
              <p>SEARCH DRUGS</p>
              <FaPills size={17} color="#555" />
          </Link>

          <Link to='/Laboratory' className='sidebar_links'>
              <p>LABORATORY</p>
              <FaPills size={17} color="#555" />
          </Link>

          <Link to='/addroster' className='sidebar_links'>
              <p>ADD ROSTER</p>
              <FaReceipt size={17} color="#555" />
          </Link>

          <Link to='/drugdate' className='sidebar_links'>
              <p>DRUG EXPIRING</p>
              <FaCalendar size={17} color="#555" />
          </Link>

          <Link to='/deletecosumable' className='sidebar_links'>
              <p>DELETE CONSUMABLES</p>
              <FaTrash size={17} color="#555" />
          </Link>

        <Link to='/history' className='sidebar_links'>
            <p>TRANSACTION HISTORY</p>
            <FaHistory
            size={17} color="#555" />
        </Link>

        <Link to='/editreceipt' className='sidebar_links'>
            <p>EDIT RECEIPT</p>
            <FaHistory
            size={17} color="#555" />
        </Link>
          
          <div className='sidebar_spacer' ></div>
  
          <div onClick={handleLogOut} className='logout_btn'>
              <FiLogOut size={17} color="#fff" />
              <p>Log-out</p>
          </div>
      </div>
  )
}

export default AdminBar