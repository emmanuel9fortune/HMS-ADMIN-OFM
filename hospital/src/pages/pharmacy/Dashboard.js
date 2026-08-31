import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { MdNotificationImportant, MdNotifications } from 'react-icons/md'
import DoctorRequest from './DoctorRequest'
import PharmacyBar from '../../components/PharmacyBar'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import { setids } from '../../features/idSlice'
import { selectip } from '../../features/ipSlice'
import NurseRequest from './NurseRequest'

function Dashboard() {
    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)

    const [currentIndex, setcurrentIndex] = useState(0)

    const dispatch = useDispatch()

    const handleView =(id)=>{
        setcurrentIndex(currentIndex + 1)
        dispatch(
            setids({
                id:id
            })
        )
    }
    const handleBack =()=>{
        setcurrentIndex(currentIndex - 1)
    }

    
    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')

    const handleSearch = async(e) => {
        e.preventDefault()
        const searchQuery = e.target.value;
        setgetsearch(searchQuery)
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${'localhost'}:7700/search`, value);
                setsearch(response.data.patients) 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

    
    const info = useSelector(selectinfo)

    const timeStampMap = new Map(
        (info?.getnotifications || []).map(item => [
            item?.uid,
            Number(item?.timeStamp) || 0
        ])
    );
    
    const sorted = [...(info?.getPatientDetails || [])].sort((a, b) => {
        const timeA = timeStampMap.get(a?._id) || 0;
        const timeB = timeStampMap.get(b?._id) || 0;
        return timeB - timeA; // Latest first
    });


  return (
    <div className='dashboard_container'>
        <PharmacyBar/>  
        
        {
            currentIndex === 0 &&
            <div className='dashboard_body' >
                <h1>Pharmacy Dashboard</h1>
                <div className='dashboard_body_header' >
                    <div className='dashboard_body_header_search'>
                        <FaSearch/>
                        <input value={getsearch} onChange={handleSearch} placeholder='Search for patients' />
                    </div>
                </div>

                <div className='patient_details_ labdash' >
                    <div className='patient_details_input_field1' >
                        <h4>PATIENTS IN QUEUE</h4>
                        
                        { search?.length > 0 ?
                            search?.map((srch, i)=>{
                                
                                return(
                                <div key={i} className='recentpatientdashcard'>
                                    <div className='recentpatientdashcard_desc'>
                                        <h4>{srch?.name}</h4>
                                        <p>{srch?.center ? "Ante Natal Patient" : "Regular Patient"}</p>
                                    </div>

                                    <div className='Patientqueuecard_button'>
                                        <button onClick={()=>handleView(srch?._id)} >View</button>
                                    </div>
                                </div>
                            )})
                            :null
                        }

                        
                        {
                            getsearch === '' ?
                                info?.getPatientDetails?.length > 0 ?
                                    sorted?.map((item, i)=>{
                                            return(
                                            <div key={i} className='recentpatientdashcard'>
                                                <div className='recentpatientdashcard_desc'>
                                                    <h4>{item?.name}</h4>
                                                    <p>{item?.center ? "Ante Natal Patient" : "Regular Patient"}</p>
                                                </div>

                                                <div className='Patientqueuecard_button'>
                                                    <button onClick={()=>handleView(item?._id)} >View</button>
                                                </div>
                                            </div>
                                            )
                                        }
                                    )
                                : null
                            : null
                        }
                    </div>

                    
                    <div className='patient_details_input_field1' >
                        <h4>NOTIFICATION</h4>    
                        <div className='notification_bar'>
                            {
                                info?.getnotifications?.length > 0 ?
                                    [...info?.getnotifications || []]?.sort((a, b)=>b.timeStamp - a.timeStamp).map((item, i)=>{
                                        const getTime = item?.timeStamp

                                        const date = new Date(Number(getTime))
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
                                        
                                        const getpatientName = info?.getPatientDetails?.find((nm)=> nm?._id === item?.uid)

                                        return (
                                    <div key={i} style={i <= 1 ? {color:'goldenrod'} : {}} className='recentpatientdashcard'>
                                        <div className='recentpatientdashcard_desc'>
                                            <p>New Prescription Sent for <strong style={{fontSize:'18px'}}>( {getpatientName?.name} )</strong></p>
                                        </div>

                                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                                            <div className='Patientqueuecard_button'>
                                                <MdNotifications size={22} style={i <= 1 ? {color:'goldenrod'} : {color:'#0463ca'}} />
                                            </div>
                                            <p>{timeString}, {`${day}-${month}-${year}`}</p>
                                        </div>

                                    </div>
                                    )})
                                : null
                            }
                        </div>

                        <h4>STOCK ALERT</h4>                        
                        <div className='task_bar'  >
                            
                            {
                                info?.utils?.length > 0 ?
                                    Object.values(info?.utils)?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>{
                                        const date = new Date(Number(item?.expireDate * 1000))
                                        const day = date.getDate()
                                        const month = date.getMonth()
                                        const year = date.getFullYear()

                                        
                                        const now = new Date()
                                        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
                                        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1

                                        const expires = item?.expireDate * 1000
                                        const today = expires >= start && expires <= end || expires < start

                                        return (
                                        <div key={i} className='recentpatientdashcard' style={{border:'.3px solid red'}}>
                                            <div className='recentpatientdashcard_desc'>
                                                <h4>{item?.name}</h4> 
                                                {
                                                    today ?
                                                    <h4>Drugs Expired</h4>
                                                    :
                                                    <p>Drugs will expire {`${day}-${month}-${year}`}</p>
                                                }
                                            </div>

                                            <div className='Patientqueuecard_button'>
                                                <MdNotificationImportant size={22} color='red' />
                                            </div>
                                        </div>
                                    )})
                                : null
                            }
                        </div>

                    </div>
                </div>
            </div>
        }

        {
            currentIndex === 1 &&
            <NurseRequest handleBack={handleBack} setcurrentIndex={setcurrentIndex} currentIndex={currentIndex} />
        }
        

        {
            currentIndex === 2 &&
            <DoctorRequest handleBack={handleBack} setcurrentIndex={setcurrentIndex} currentIndex={currentIndex} />
        }
        
    </div>
  )
}

export default Dashboard