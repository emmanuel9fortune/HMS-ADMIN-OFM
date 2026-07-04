import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import Searchpatientresulttab from '../../components/Searchpatientresulttab';
import axios from 'axios';
import PatientDetails from '../doctor/PatientDetails';
import AdminBar from '../../components/AdminBar';
import { toast } from 'react-toastify';

function Searchpatient() {
    //axios.defaults.withCredentials = true
    const [currentIndex, setcurrentIndex] = useState(0)

    const handleBack =()=>{
        setcurrentIndex(currentIndex - 1)
    }

    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')
  const cip = window.location.hostname


    
    const handleSearch = async(e) => {
        
        const searchQuery = typeof e === 'string' ? e : e?.target?.value || '';
        setgetsearch(searchQuery);

        if (searchQuery.trim().length === 0) {
            setsearch([]);
            return;
        }
        
        
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

    const admin = true
    
    const [delet, setdelet] = useState({})

    
    const handleDelete =async()=>{
        try {
            await axios.post(`http://${cip || 'localhost'}:7700/deletePatient`, {uid: delet?._id}).then((res)=>{
                if(res.data.status === 'success'){
                handleSearch(getsearch)
                setdelet('')
                toast.success('CARD DELETED SUCCESSFULLY')
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='dashboard_container'>
        <AdminBar/>

        {
            currentIndex === 0 &&
            <div className='dashboard_body' >
                <div className='dashboard_body_header' >
                    <div className='dashboard_body_header_search'>
                        <FaSearch/>
                        <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                    </div>
                </div>

                <h3>SEARCH RESULTS</h3>
                <div>
                    {
                        search?.length > 0 ?
                            search?.map((srch, i)=>(
                                <Searchpatientresulttab admin={true} key={i} srch={srch} setdelet={setdelet} setview={setcurrentIndex} />
                            ))
                        : null 
                    }
                </div>
            </div>
        }

        
        {
            currentIndex === 1 &&
            <PatientDetails admin={admin} handleBack={handleBack}/>
        }

        
           {  delet?.name &&
             <div style={{position:'absolute', width:'100%', height:'100%',  display:'flex', flexDirection:'column', backgroundColor:'transparent', top:'0', left:'0', alignItems:'center', justifyContent:'center'}}>
                <div style={{width:'450px', height:'300px', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding:'20px'}}>
                
                    <div className='patient_details_input_field1_'  >
                        <h1>Want to Delete {delet?.name}'s Card' ?</h1>
                    </div>
                    
                    <button className='add_staff_contaimer_button' onClick={handleDelete} style={{color:'white', background:'red'}}>CONFIRM</button>
                    <button className='add_staff_contaimer_button' onClick={()=>setdelet('')} style={{color:'blue', background:'Whitesmoke'}}>CANCEL EDIT</button>
                </div>
             </div>
           }
    </div>
  )
}

export default Searchpatient;