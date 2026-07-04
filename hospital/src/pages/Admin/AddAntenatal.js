import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'

function AddAntenatal() {
    const [utilities, setutilities] = useState([])
      const [reload, setreload] = useState(0)
      const [suscript, setsuscript] = useState('')
      const cip = window.location.hostname
    
      useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{
          try {
            await axios.post(`http://${cip || 'localhost'}:7700/getsubscriptions`, {signal: controller.signal}).then((res)=>{  
                console.log(res);
                        
              if(res.data.status === 'success'){
                setutilities(res.data.diagnosis)
                setreload(0)
              }
            })
          } catch (error) {
            console.log(error); 
          }
        }
        func()
      return ()=> controller.abort()
      },[reload, cip])
      
      const [name, setname] = useState('')
      const [duration, setduration] = useState('')
      
      const handleDelete =async(id)=>{
        try {
          await axios.post(`http://${cip  || 'localhost'}:7700/deletesubscription`, {serveID: id}).then((res)=>{
            if(res.data.status === 'success'){
              setreload(reload + 1)
            }
          })
        } catch (error) {
          console.log(error);
        }
      }
    
      const handleAddUSubscription =async()=>{
    
        const value ={
          name,
          suscript,
          duration,
        }
    
        try {
          await axios.post(`http://${cip  || 'localhost'}:7700/Addsubscript`, value).then((res)=>{
            console.log(res);
            
            if(res.data.status === 'success'){
              toast.success('DIAGNOSIS ADDED SUCCESSFULLY')
              setname('')
              setreload(reload + 1)
            }
          })
        } catch (error) {
          console.log(error);
        }
      }

      
    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')

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

                const response = await axios.post(`http://${cip || 'localhost'}:7700/searchSubscription`, value);                
                setsearch(response.data.patients)                 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

  return (
    <div className='payment_desk'>
        <div className='payment_desk_input_fields add_utilities'>
            <div className='patient_details_input_field1_' >
                <h4>SELECT ANTENATAL SUBSCRIPTION</h4>
                <select value={suscript} onChange={(e)=> setsuscript(e.target.value)}>
                    <option value={''}>SELECT PACKAGE TYPE</option>
                    <option value={'BASIC PACKAGE'}>BASIC PACKAGE</option>
                    <option value={'SILVER PACKAGE'}>SILVER PACKAGE</option>
                    <option value={'GOLD PACKAGE'}>GOLD PACKAGE</option>
                </select>
            </div>
            <div className='patient_details_input_field1_' >
                <h4>PACKAGE NAME</h4>
                <input value={name} onChange={(e)=>setname(e.target.value)} placeholder='Enter Package Name' />
            </div>

            <div className='patient_details_input_field1_' >
                <h4>DURATION</h4>
                <input value={duration} onChange={(e)=>setduration(e.target.value)} placeholder='Enter Duration Name' />
            </div>
            
            {
                name ?
                <button onClick={handleAddUSubscription} className='add_staff_contaimer_button' >UPLOAD DIAGNOSIS</button>
                :
                <button style={{opacity:'0.3'}} className='add_staff_contaimer_button' >UPLOAD DIAGNOSIS</button>
            }
        </div>

        
        <div className='payment_desk_input_fields add_utilities' >
            <h4>RECENTLY ADDED DIAGNOSIS</h4>
            <div className='display_all_utilities_contianer'>
            <div className='dashboard_body_header_search'>
                <FaSearch/>
                <input value={getsearch} onChange={handleSearch} placeholder='Search' />
            </div>
            <div className='display_all_utilities' >
                {
                    search?.length > 0 ?
                    search?.map((srch, i)=>(
                        <div key={i} >
                        <div>
                            <p>Name: {srch?.name}</p>
                            <p>Type: {srch?.suscript}</p>
                            <p>Duration: {srch?.duration}</p>
                        </div>
                        <button onClick={()=>handleDelete(srch?._id)} >DELETE</button>
                        </div>
                    ))
                        :
                utilities?.length > 0 ?
                    utilities?.map((cat, i)=>{
                    return(
                    <div key={i} >
                    <div>
                        <p>Name: {cat?.name}</p>
                        <p>Type: {cat?.suscript}</p>
                        <p>Duration: {cat?.duration}</p>
                    </div>
                    <button onClick={()=>handleDelete(cat?._id)} >DELETE</button>
                    </div>
                    )})
                : null
                }
            </div>
            </div>
        </div>
    </div>
  )
}

export default AddAntenatal