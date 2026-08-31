import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaSearch } from 'react-icons/fa'

function AddAntenatal() {
    const [utilities, setutilities] = useState([])
    const [cards, setcards] = useState({})
      const [reload, setreload] = useState(0)
      const cip = window.location.hostname
    
      useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{
          try {
            await axios.post(`http://${cip || 'localhost'}:7700/getsubscriptions`, {signal: controller.signal}).then((res)=>{  
                // console.log(res);
                        
              if(res.data.status === 'success'){
                setutilities(res.data.diagnosis)
                setcards(res.data.cards)
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
          name
        }
    
        try {
          await axios.post(`http://${cip  || 'localhost'}:7700/Addsubscript`, value).then((res)=>{
            // console.log(res);
            
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

    const [morningCardAmount, setmorningCardAmount] = useState(0)
    const [eveningCardAmount, seteveningCardAmount] = useState(0)
    const [familyCardAmount, setfamilyCardAmount] = useState(0)
    

    const handleEditCard =async()=>{
      try {
        const value = {     
            morningCardAmount: morningCardAmount ? morningCardAmount : cards?.morningCardAmount,
            eveningCardAmount: eveningCardAmount ? eveningCardAmount : cards?.eveningCardAmount,
            familyCardAmount: familyCardAmount ? familyCardAmount : cards?.familyCardAmount,           
        }        

        const response = await axios.post(`http://${cip || 'localhost'}:7700/editcards`, value);  
        toast.success('CHANGES SAVED')
        setreload(reload + 1)  
        setmorningCardAmount(0)            
        seteveningCardAmount(0)            
        setfamilyCardAmount(0)            
          
      } catch (err) {
          console.error('Error fetching search results', err);
      }
    }

  return (
    <div className='payment_desk'>
        <div className='payment_desk_input_fields add_utilities'>
          <div className='patient_details_input_field1_' >
              <h4>CATALOGUE NAME</h4>
              <input value={name} onChange={(e)=>setname(e.target.value)} placeholder='Enter Package Name' />
          </div>
          
          {
              name ?
              <button onClick={handleAddUSubscription} className='add_staff_contaimer_button' >UPLOAD DIAGNOSIS</button>
              :
              <button style={{opacity:'0.3'}} className='add_staff_contaimer_button' >UPLOAD DIAGNOSIS</button>
          }

          <div className='payment_desk_input_fields add_utilities' style={{width:'100%'}}>
            
            <div className='patient_details_input_field1_in_'>
                <div className='patient_details_input_field1_in' >
                    <h4>MORNING CARD PRICE</h4>
                    <h3 style={{margin:'10px 0'}}>₦{cards?.morningCardAmount}</h3>
                    <input value={morningCardAmount} onChange={(e)=>setmorningCardAmount(e.target.value)} type='number'  placeholder='Enter Price' />
                </div>
                <div className='patient_details_input_field1_in' >
                    <h4>EVENING CARD PRICE</h4>
                    <h3 style={{margin:'10px 0'}}>₦{cards?.eveningCardAmount}</h3>
                    <input value={eveningCardAmount} onChange={(e)=>seteveningCardAmount(e.target.value)} type='number'  placeholder='Enter Price' />
                </div>
            </div>
            
            <div className='patient_details_input_field1_in_'>
                <div className='patient_details_input_field1_in' >
                    <h4>FAMILY CARD PRICE</h4>
                    <h3 style={{margin:'10px 0'}}>₦{cards?.familyCardAmount}</h3>
                    <input value={familyCardAmount} onChange={(e)=>setfamilyCardAmount(e.target.value)} type='number'  placeholder='Enter Price' />
                </div>
            </div>

            {
              eveningCardAmount || morningCardAmount || familyCardAmount ?
                <button onClick={handleEditCard} className='add_staff_contaimer_button' >SAVE CHANGES</button>
                :
                <button style={{opacity:'0.3'}} className='add_staff_contaimer_button' >SAVE CHANGES</button>
            }
          </div>
        </div>



        
        <div className='payment_desk_input_fields add_utilities' >
            <h4>RECENTLY ADDED CATALOGUE</h4>
            <div className='display_all_utilities_contianer'>
            <div className='dashboard_body_header_search'>
                <FaSearch/>
                <input value={getsearch} onChange={handleSearch} placeholder='Search' />
            </div>
            <div className='display_all_utilities' >
                {
                    search?.length > 0 ?
                    search?.map((srch, i)=>(
                        <div key={i} style={{padding:'15px'}}>
                        <div>
                            <p>Name: {srch?.name}</p>
                        </div>
                        <button onClick={()=>handleDelete(srch?._id)} >DELETE</button>
                        </div>
                    ))
                        :
                utilities?.length > 0 ?
                    utilities?.map((cat, i)=>{
                    return(
                    <div key={i} style={{padding:'15px'}}>
                    <div>
                        <p>Name: {cat?.name}</p>
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