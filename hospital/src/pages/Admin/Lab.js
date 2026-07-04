import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import LabResults from './LabResults'
import ReunTest from './ReunTest'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setids } from '../../features/idSlice'
import ScanUpload from './ScanUpload'
import { FiLoader } from 'react-icons/fi'
import AdminBar from '../../components/AdminBar'

function Lab() {

    //axios.defaults.withCredentials = true
  const cip = window.location.hostname

    const [currentIndex, setcurrentIndex] = useState(0)
    const handleRunTest =(id)=>{
        setcurrentIndex(currentIndex + 2)
        dispatch(
            setids({
                id:id,
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

    const handleScanUpload =(id)=>{
        setcurrentIndex(3)
        dispatch(
            setids({
                id:id
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

                const response = await axios.post(`http://${cip || 'localhost'}:7700/search`, value);
                setsearch(response.data.patients) 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

     
    

  return (
    <div className='dashboard_container'>
        <AdminBar/>
        
        {
            currentIndex === 0 &&
            <div className='dashboard_body' >
                <h1>Lab Scientist Dashboard</h1>
                <div className='dashboard_body_header' >
                    <div className='dashboard_body_header_search'>
                        <FaSearch/>
                        <input value={getsearch} onChange={handleSearch} placeholder='Search for patients' />
                    </div>
                    
                    <div className='dashboard_body_header_displays' style={{cursor:'pointer'}} onClick={()=>window.location.reload()} >
                        <div className='dashboard_body_header_displays_icon'>
                        <FiLoader size={25} color="#0463ca" />
                        </div>
                        <div className='dashboard_body_header_displays_text'>
                        <h1>Reload</h1>
                        </div>
                    </div>
                </div>

                    <div className='patient_details_input_field1' style={{width:'100%', marginTop:20}}>                        
                        { search?.length > 0 ?
                            search?.map((srch, i)=>{
                                
                                return(
                                <div key={i} className='recentpatientdashcard'>
                                    <div className='recentpatientdashcard_desc'>
                                        <h4>{srch?.name}</h4>
                                        <p>{srch?.center ? "Ante Natal Patient" : "Regular Patient"}</p>
                                    </div>

                                    <div className='Patientqueuecard_button'>
                                        <button onClick={()=>handleScanUpload(srch?._id)} style={{margin:'0 5px'}} className='add_new_patient_container_btns2' >RUN SCAN</button>
                                        <button onClick={()=>handleRunTest(srch?._id)} style={{margin:'0 5px'}} className='add_new_patient_container_btns2' >RUN TEST</button>
                                                
                                        <button onClick={()=>handleView(srch?._id)} >VIEW</button>
                                    </div>
                                </div>
                            )})
                            :null
                        }
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

export default Lab