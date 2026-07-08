import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import AddDiagnosis from './AddDiagnosis'
import AddAntenatal from './AddAntenatal'

function AddServices() {

  //axios.defaults.withCredentials = true

  const [utilities, setutilities] = useState([])
  const [reload, setreload] = useState(0)
  const cip = window.location.hostname

  useEffect(()=>{
    const controller = new AbortController() 
    const func =async()=>{
      try {
        await axios.post(`http://${cip || 'localhost'}:7700/getService`, {signal: controller.signal }).then((res)=>{          
          if(res.data.status === 'success'){
            setutilities(res.data.services)
            setreload(0)
          }
        })
      } catch (error) {
        // console.log(error); 
      }
    }
    func()
      return ()=> controller.abort()
  },[reload, cip])
  
  const [name, setname] = useState('')
  const [originalPrice, setoriginalPrice] = useState('')
  const [sellingPrice, setsellingPrice] = useState('')
  
  const handleDelete =async(id)=>{
    try {
      await axios.post(`http://${cip  || 'localhost'}:7700/deleteService`, {serveID: id}).then((res)=>{
        if(res.data.status === 'success'){
          setreload(reload + 1)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddUtils =async()=>{

    const value ={
      name,
      price: originalPrice,
      type: sellingPrice,
    }

    try {
      await axios.post(`http://${cip  || 'localhost'}:7700/AddService`, value).then((res)=>{
        if(res.data.status === 'success'){
          toast.success('SERVICE ADDED SUCCESSFULLY')
          setreload(reload + 1)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const [count, setcount] = useState(0)

  const [basic, setbasic] = useState(0)
  const [silver, setsilver] = useState(0)
  const [gold, setgold] = useState(0)

  useEffect(()=>{
    const func =async()=>{
      try {
        await axios.post(`http://${cip || 'localhost'}:7700/antenatalsub/get`).then((res)=>{    
          if(res.data.status === 'success'){
            setbasic(res.data.getsub.basic)
            setsilver(res.data.getsub.silver)
            setgold(res.data.getsub.gold)
            setreload(0)
          }
        })
      } catch (error) {
        console.log(error); 
      }
    }
    func()
  }, [reload, cip])

  const handleAnteNatalSub =async()=>{
    const value ={
      basic,
      silver,
      gold,
    }

    try {
      await axios.post(`http://${cip  || 'localhost'}:7700/antenatalsub`, value).then((res)=>{
        
        if(res.data.status === 'success'){
          toast.success('SUBSCRIPTION ADDED SUCCESSFULLY')
          setreload(reload + 1)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  
  const [getsearch, setgetsearch] = useState('')
  const [search, setsearch] = useState([])
  
  const handleSearch = async(e) => {
      e.preventDefault()
      const searchQuery = e.target.value;
      setgetsearch(searchQuery)
      if (searchQuery.length > 0) {
          try {
              const value = {     
                  search : searchQuery
              }

              const response = await axios.post(`http://${cip || 'localhost'}:7700/searchRequest`, value);
              console.log(response);
              
              setsearch(response.data.utils) 
              
          } catch (err) {
              console.error('Error fetching search results', err);
          }
      } else {
          setsearch([]);
      }
  }
      
  
  const [getItems, setGetItems] = useState({})
  const [delet, setdelet] = useState({})
  
  const [sname, setsname] = useState('')
  const [price, setprice] = useState('')
  const [type, settype] = useState('')

  useEffect(()=>{
      setsname(getItems?.name)
      setprice(getItems?.price)
      settype(getItems?.type)
  },[getItems])

  const handlename =async(e)=>{
      setsname(e.target.value)        
      try {
          await axios.post(`http://${cip || 'localhost'}:7700/editservice`, {name: e.target.value, price, type, id: getItems?._id}).then((res)=>{
              setreload(reload + 1)
              console.log(res);
          })
      } catch (error) {
          console.log(error);
      }
  }

  const handleprice =async(e)=>{
      setprice(e.target.value)        
      try {
          await axios.post(`http://${cip || 'localhost'}:7700/editservice`, {price: e.target.value, name: sname, type, id: getItems?._id}).then((res)=>{
              setreload(reload + 1)
              console.log(res);
              
          })
      } catch (error) {
          console.log(error);
      }
  }

  const handletype =async(e)=>{
      settype(e.target.value)        
      try {
          await axios.post(`http://${cip || 'localhost'}:7700/editservice`, {type: e.target.value, name: sname, price, id: getItems?._id}).then((res)=>{
              setreload(reload + 1)
          })
      } catch (error) {
          console.log(error);
      }
  }

  


  return (
    <div className='dashboard_container'>
      <AdminBar/> 
        <div className='dashboard_body' >

          <div style={{width:'fit-content', borderRadius:'999px', border:'1px solid grey', padding:'5px'}} >
              <button style={count !== 0 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(0)}>ADD SERVICES</button>
              <button style={count !== 1 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(1)}>ADD DIAGNOSIS</button>
              <button style={count !== 2 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(2)}>ADD CATALOGUE</button>
          </div>
          {
            count === 0 ?
              <div className='payment_desk' >
                  <h3>ADD SERVICES</h3>
 

                <div className='payment_desk_input_fields add_utilities'>

                  <div className='patient_details_input_field1_' >
                    <h4>SERVICE NAME</h4>
                    <input value={name} onChange={(e)=>setname(e.target.value)} placeholder='Enter Service Name' />
                  </div>
                  
                  <div className='patient_details_input_field1_in_'>
                      <div className='patient_details_input_field1_in' >
                          <h4>PRICE</h4>
                          <input value={originalPrice} onChange={(e)=>setoriginalPrice(e.target.value)} type='number'  placeholder='Enter Price' />
                      </div>
                      <div className='patient_details_input_field1_in' >
                          <h4>SERVICE TYPE</h4>
                          <select style={{width:'100%', padding:'15px'}} value={sellingPrice} onChange={(e)=>setsellingPrice(e.target.value)}>
                              <option >SELECT SERVICE TYPE</option>
                              <option value={'scan'} >SCAN</option>
                              <option value={'test'}>TEST</option>
                              <option value={'card'}>CARD</option>
                          </select>
                      </div>
                  </div>
                  
                  <button onClick={handleAddUtils} className='add_staff_contaimer_button' >UPLOAD SERVICES</button>

                  <h3>EDIT ANTENATAL SUBSCRIPTION</h3>
                  
                    <div className='patient_details_input_field1_in' >
                        <h4>BASIC</h4>
                        <input value={basic} onChange={(e)=>setbasic(e.target.value)} type='number'  placeholder='Enter Price' />
                    </div>
                  
                    <div className='patient_details_input_field1_in' >
                        <h4>SILVER</h4>
                        <input value={silver} onChange={(e)=>setsilver(e.target.value)} type='number'  placeholder='Enter Price' />
                    </div>
                  
                    <div className='patient_details_input_field1_in' >
                        <h4>GOLD</h4>
                        <input value={gold} onChange={(e)=>setgold(e.target.value)} type='number'  placeholder='Enter Price' />
                    </div>
                    
                  <button onClick={handleAnteNatalSub} className='add_staff_contaimer_button' >UPDATE SUBSCRIPTION</button>
                </div>

                
                <div className='payment_desk_input_fields add_utilities' >
                  
                <div className='patient_details_input_field1_' style={{width:'90%', marginBottom:'30px'}}>
                  <h4>SEARCH SERVICE</h4>
                  <input value={getsearch} onChange={handleSearch} style={{width:'100%'}} placeholder='Search for service' />
                </div>

                  <h4>RECENTLY ADDED SERVICES</h4>
                  <div className='display_all_utilities_contianer'>
                    <div className='display_all_utilities' >
                      {
                        search?.length > 0  ?
                        search?.map((res, i)=>(
                            <div key={i}  style={{width:'100%', display:'flex', justifyContent:'space-between', margin:'5px 0', alignItems:'center' }}>
                              
                                <div  style={{width:'100%', display:'flex', justifyContent:'space-between', margin:'5px 0', alignItems:'center' }} >
                                  <div>
                                    <p>{res?.name}</p>
                                    <p>Service Type:  ({res?.type})</p>
                                    <small>{res?.price}</small>
                                  </div>
                                  <div style={{display:'flex', flexDirection:'column'}} >
                                    <button style={{ padding:'5px 10px', backgroundColor:'red', color:'white'}} onClick={()=>setdelet(res)} >DELETE</button>
                                    <button style={{marginTop:'10px', padding:'5px 10px', backgroundColor:'orange'}} onClick={()=>setGetItems(res)}>EDIT</button>
                                  </div>
                                </div>
                            </div>
                          )) :
                        utilities?.length > 0 ?
                          utilities?.map((cat, i)=>{
                          return(
                          <div key={i} >
                            <div>
                              <p>Name: {cat?.name}</p>
                              <p>Service Type:  ({cat?.type})</p>
                              <h4>Quantity: {cat?.price}</h4>
                            </div>
                            <div style={{display:'flex', flexDirection:'column'}} >
                              <button style={{ padding:'5px 10px', backgroundColor:'red', color:'white'}} onClick={()=>setdelet(cat)} >DELETE</button>
                              <button style={{marginTop:'10px', padding:'5px 10px', backgroundColor:'orange'}} onClick={()=>setGetItems(cat)}>EDIT</button>
                            </div>
                          </div>
                          )})
                        : null
                      }
                    </div>
                  </div>
                </div>
              </div>
            : null
          }

          {
            count === 1 ?
              <div className='payment_desk' >  
                 <AddDiagnosis/>
              </div>
            : null
          }

          {
            count === 2 ?
              <div className='payment_desk' >  
                 <AddAntenatal/>
              </div>
            : null
          }

          
           {  getItems?.name &&
             <div style={{position:'absolute', width:'100%', height:'100%',  display:'flex', flexDirection:'column', backgroundColor:'transparent', top:'0', left:'0', alignItems:'center', justifyContent:'center'}}>
                <div style={{width:'700px', height:'fit-content', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding:'20px'}}>
                
                    <div className='patient_details_input_field1_'  >
                        <h4>SERVICE NAME</h4>
                        <input style={{fontSize:'14px'}} value={sname} placeholder={getItems?.name} onChange={handlename} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>SERVICE PRICE</h4>
                        <input style={{fontSize:'14px'}} type='number' value={price} placeholder={getItems?.price} onChange={handleprice} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>SERVICE TYPE</h4>
                        <input style={{fontSize:'14px'}} value={type} placeholder={getItems?.type} onChange={handletype} />
                    </div>
                    
                    <button className='add_staff_contaimer_button' onClick={()=>[setGetItems(''), setreload(reload + 1)]} 
                    style={{color:'blue', background:'Whitesmoke'}}>DONE</button>
                </div>
             </div>
           }

          
           {  delet?.name &&
             <div style={{position:'absolute', width:'100%', height:'100%',  display:'flex', flexDirection:'column', backgroundColor:'transparent', top:'0', left:'0', alignItems:'center', justifyContent:'center'}}>
                <div style={{width:'400px', height:'300px', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding:'20px'}}>
                
                    <div className='patient_details_input_field1_'  >
                        <h1>Want to Delete {delet?.name} ?</h1>
                    </div>
                    
                    <button className='add_staff_contaimer_button' onClick={()=>[handleDelete(delet?._id), setsearch([]), setgetsearch(''), setdelet({})]} style={{color:'white', background:'red'}}>CONFIRM</button>
                    <button className='add_staff_contaimer_button' onClick={()=>setdelet('')} style={{color:'blue', background:'Whitesmoke'}}>CANCEL EDIT</button>
                </div>
             </div>
           }
          
      </div>
    </div>
  )
}

export default AddServices