import React from 'react'
import './sidebar.css'
import logo from '../img/logo.jpg'
import { FaCreditCard, FaHistory, FaPlus, FaSearchPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { MdEventNote, MdGroups3 } from 'react-icons/md';
import { useSelector } from 'react-redux'
import { selectip } from '../features/ipSlice'
import axios from 'axios'

function SideBar() {

    const ip = useSelector(selectip)
    const getStaffInfo = sessionStorage.getItem('staffID')
    const jsoninfo = JSON.parse(getStaffInfo)
        const navigate = useNavigate()
        
    
    const handleLogOut =async()=>{
        try{
            await axios.post(`http://localhost:7700/staffLogout`,{staffID: jsoninfo?._id}).then((res)=>{
                if(res.data.status === 'success'){
                    navigate('/')
                    sessionStorage.removeItem('staffID')
                    window.location.reload()
                }
            })
        }catch(error){
            console.log(error)
        }
    }

    
    const date1 = new Date(Number(jsoninfo?.loginTimeStamp))

    let hours = date1.getHours()
    const minutes = date1.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12

    const pad = (n) => n.toString().padStart(2, '0')

    const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

  return (
    <div className='sidebar_container'>
        <div className='sidebar_logo'>
            <img src={logo} alt='' />
            <h3>O.F.M. Medical Centre</h3>
        </div>

        <Link to='/newpatient' style={{marginTop:'40px'}} className='sidebar_links'>
            <FaPlus size={17} color="#0463ca" />
            <p style={{color:'#0463ca'}} >Add new patient</p>
        </Link>

        <div className='sidebar_spacer' ></div>
        
        <Link to='/' className='sidebar_links'>
            <p>DASHBOARD</p>
            <MdEventNote size={17} color="#555" />
        </Link>

        <Link to='/searchpatient' className='sidebar_links'>
            <p>SEARCH PATIENT</p>
            <FaSearchPlus size={17} color="#555" />
        </Link>
        
        <Link  to='/patientqueue' className='sidebar_links'>
            <p>PATIENT QUEUE</p>
            <MdGroups3 size={20} color="#555" />
        </Link>

        <Link to='/paymentdesk' className='sidebar_links'>
            <p>PAYMENT DESK</p>
            <FaCreditCard size={17} color="#555" />
        </Link>

        <Link to='/history' className='sidebar_links'>
            <p>TRANSACTION HISTORY</p>
            <FaHistory
             size={17} color="#555" />
        </Link>
        
        <div className='sidebar_spacer' ></div>
        
        <div className='staff_info_display'>
            <img src={`http://localhost:7700/uploads/staffs/${jsoninfo?.photo}`} alt='' />
            <div>
                <h4>{jsoninfo?.name}</h4>
                <p>{jsoninfo?.title}</p>
                <p>{timeString}</p>
            </div>
        </div>

        <div onClick={handleLogOut} className='logout_btn'>
            <FiLogOut size={17} color="#fff" />
            <p>Log-out</p>
        </div>
    </div>
  )
}

export default SideBar