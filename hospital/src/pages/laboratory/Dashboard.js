import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { MdNotifications } from 'react-icons/md'
import LabResults from './LabResults'
import ReunTest from './ReunTest'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setids } from '../../features/idSlice'
import { selectinfo } from '../../features/infoSlice'
import { toast } from 'react-toastify'
import ScanUpload from './ScanUpload'
import { selectip } from '../../features/ipSlice'
import LabBar from '../../components/LabBar'

function Dashboard() {

    //axios.defaults.withCredentials = true
        const ip = useSelector(selectip)

    const [currentIndex, setcurrentIndex] = useState(0)
    const handleRunTest =({id, docID})=>{
        setcurrentIndex(currentIndex + 2)
        dispatch(
            setids({
                id:id,
                docID
            })
        )
    }


    const dispatch = useDispatch()

    const handleView =(id)=>{
        setcurrentIndex(currentIndex + 1)
        dispatch(
            setids({
                id:id,
            })
        )
    }

    const handleScanUpload =(id, docID)=>{
        setcurrentIndex(3)
        dispatch(
            setids({
                id:id,
                docID
            })
        )
    }

    const handleBack =()=>{
        setcurrentIndex(0 )
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

 
    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)

    const handleUpdateTask =async(ids)=>{
        try {
        await axios.post(`http://${'localhost'}:7700/updatetask`, {taskId: ids, uid: getid?._id }).then((res)=>{
            if(res.data.status === 'success'){
                toast.success('Task completed')
            }
        })
        } catch (error) {
        console.log(error);
        }
    }

    const timeStampMap = new Map(
        (info?.getrequest || []).map(item => [
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
        <LabBar/>
        
        {
            currentIndex === 0 &&
            <div className='dashboard_body' >
                <h1>Lab Scientist Dashboard</h1>
                <div className='dashboard_body_header' >
                    <div className='dashboard_body_header_search'>
                        <FaSearch/>
                        <input value={getsearch} onChange={handleSearch} placeholder='Search for patients' />
                    </div>
                </div>

                <div className='patient_details_ labdash' >
                    <div className='patient_details_input_field1' >
                        <h4>TEST REQUESTs</h4>
                        
                        { search?.length > 0 ?
                            search?.map((srch, i)=>{
                                const docID = info?.getrequest?.filter((doc)=> doc?.uid === srch?._id )
                                .sort((a, b)=> b.timeStamp - a.timeStamp)
                                
                                return(
                                <div key={i} className='recentpatientdashcard'>
                                    <div className='recentpatientdashcard_desc'>
                                        <h4>{srch?.name}</h4>
                                        <p>{srch?.center ? "Ante Natal Patient" : "Regular Patient"}</p>
                                    </div>

                                    <div className='Patientqueuecard_button'>
                                        <button onClick={()=>handleScanUpload({id:srch?._id, docID: docID[0]?.staffID})} style={{margin:'0 5px'}} className='add_new_patient_container_btns2' >RUN SCAN</button>
                                        <button onClick={()=>handleRunTest({id:srch?._id, docID: docID[0]?.staffID})} style={{margin:'0 5px'}} className='add_new_patient_container_btns2' >RUN TEST</button>
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
                                           const docID = info?.getrequest?.filter((doc)=> doc?.uid === item?._id )
                                           .sort((a, b)=> b.timeStamp - a.timeStamp)
                                            return(
                                            <div key={i} className='recentpatientdashcard'>
                                                <div className='recentpatientdashcard_desc'>
                                                    <h4>{item?.name}</h4>
                                                    <p>{item?.center ? "Ante Natal Patient" : "Regular Patient"}</p>
                                                </div>

                                                <div className='Patientqueuecard_button'>
                                                    <button onClick={()=>handleScanUpload({id:item?._id, docID: docID[0]?.staffID})} style={{margin:'0 5px'}} className='add_new_patient_container_btns2' >RUN SCAN</button>
                                                    <button onClick={()=>handleRunTest({id: item?._id, docID: docID[0]?.staffID})} style={{margin:'0 5px'}} className='add_new_patient_container_btns2' >RUN TEST</button>
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
                                info?.getrequest?.length > 0 ?
                                    [...info?.getrequest]?.sort((a, b)=> b?.timeStamp - a?.timeStamp)?.map((item, i)=>{
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
                                        const getpatientName = info?.getPatientDetails?.find((nm)=> nm?._id === item?.uid)

                                        return (
                                    <div key={i} style={i <= 1 ? {color:'goldenrod'} : {}} className='recentpatientdashcard'>
                                        <div className='recentpatientdashcard_desc'>
                                            <p>{item?.requests} <strong style={{fontSize:'18px'}}>( {getpatientName?.name} )</strong></p>
                                        </div>

                                        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                                            <div className='Patientqueuecard_button'>
                                                <MdNotifications size={22} style={i <= 1 ?{color:'goldenrod'} : {color:'#0463ca'}} />
                                            </div>
                                            <p>{timeString}, {`${day}-${month}-${year}`}</p>
                                        </div>

                                    </div>
                                    )})
                                : null
                            }
                        </div>

                        <h4>TASKS</h4>                        
                        
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
                                        <button className='add_new_patient_container_btns2' onClick={()=>handleUpdateTask(item?._id)} >DONE</button>
                                        }
                                    </div>
                                </div>
                                )})
                            : null
                        }

                    </div>
                </div> 
            </div>
        } 

        {
            currentIndex === 1 &&
            <LabResults handleBack={handleBack}/>
        }

        {
            currentIndex === 2 &&
            <ReunTest handleBack={handleBack}/>
        }

        {
            currentIndex === 3 &&
            <ScanUpload handleBack={handleBack}/>
        }
        
    </div>
  )
}

export default Dashboard