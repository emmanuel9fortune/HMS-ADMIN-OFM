import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { selectip } from '../../features/ipSlice'
import { useSelector } from 'react-redux'

function AddUtils() {

  //axios.defaults.withCredentials = true
  const ip = useSelector(selectip)

  const [utilities, setutilities] = useState([])
  const [reload, setreload] = useState(0)
  const cip = window.location.hostname

  useEffect(()=>{
    const controller = new AbortController()
    const func =async()=>{
      try {
        await axios.post(`http://${cip || 'localhost'}:7700/getUtils`, {signal: controller.signal }).then((res)=>{          
          if(res.data.status === 'success'){
            setutilities(res.data.utils)
            setreload(0)
          }
        })
      } catch (error) {
        console.log(error);
      }
    }
    func()
    return ()=> controller.abort()
  },[reload, ip])
  
  const [name, setname] = useState('')
  const [batch, setbatch] = useState('')
  const [type, settype] = useState('')
  const [quantity, setquantity] = useState(0)
  const [limit, setlimit] = useState(0)
  const [explimit, setexplimit] = useState(0)
  const [expireDate, setexpireDate] = useState('')
  const [originalPrice, setoriginalPrice] = useState('')
  const [sellingPrice, setsellingPrice] = useState('')
  const [clas, setclas] = useState('')
  
  const handleDelete =async(id)=>{
    try {
      await axios.post(`http://${cip || 'localhost'}:7700/deleteUtils`, {utilID: id}).then((res)=>{
        if(res.data.status === 'success'){
          setreload(reload + 1)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const [date, setdate] = useState(null)

  const handleChange =(e)=>{
    const selectDate = e.target.value
    setdate(selectDate)

    const dateObj = new Date(selectDate)

    const unixTimeMs = dateObj.getTime()

    const unixTimeSec = Math.floor(unixTimeMs/1000)

    setexpireDate(unixTimeSec)
  }

  const handleAddUtils =async()=>{

    const value ={
      name,
      quantity: quantity.trim(),
      expireDate,
      originalPrice,
      sellingPrice,
      batch: batch.trim(),
      limit: limit.trim(),
      explimit: explimit.trim(),
      type,
      date: new Date().getTime(),
      clas
    }

    try {
      await axios.post(`http://${cip || 'localhost'}:7700/AddUtils`, value).then((res)=>{
        if(res.data.status === 'success'){
          toast.success('UTILITY ADDED SUCCESSFULLY')
          setreload(reload + 1)
          setname('')
          setquantity('')
          setexpireDate('')
          setoriginalPrice('')
          setsellingPrice('')
          setbatch('')
          setlimit('')
          setexplimit('')
          setdate('')
          settype('')
        }
      })
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='dashboard_container'>
      <AdminBar/> 

      <div className='dashboard_body' >
        <div className='payment_desk' >
            <h3>ADD DRUG | UTILITIES | CONSUMABLES</h3>


          <div className='payment_desk_input_fields add_utilities'>
            <h3 style={{marginBottom:'20px'}} >ENTER DETAILS</h3>
            <div className='patient_details_input_field1_' >
              <h4>NAME</h4>
              <input value={name} onChange={(e)=>setname(e.target.value)} placeholder='Enter Utility Name' />
            </div>
            
            <div className='patient_details_input_field1_in_'>
                <div className='patient_details_input_field1_in' >
                  <h4>BATCH</h4>
                  <input value={batch} onChange={(e)=>setbatch(e.target.value)} placeholder='Enter Batch' />
                </div>
                <div className='patient_details_input_field1_' >
                    <h4>SELECT TYPE</h4>
                    <select value={type} onChange={(e)=>settype(e.target.value)}>
                      <option >Select Utilities Type</option>
                      <option value={'drugs'} >Drugs</option>
                      <option value={'utils'} >Utils</option>
                      <option value={'consumable'} >Consumables</option>
                    </select>
                </div>
            </div>
            
            <div className='patient_details_input_field1_in_'>
                <div className='patient_details_input_field1_in' >
                    <h4>ORIGINAL PRICE</h4>
                    <input value={originalPrice} onChange={(e)=>setoriginalPrice(e.target.value)} type='number'  placeholder='Enter Original Price' />
                </div>
                <div className='patient_details_input_field1_in' >
                    <h4>SELLING PRICE</h4>
                    <input value={sellingPrice} onChange={(e)=>setsellingPrice(e.target.value)} type='number'  placeholder='Enter Selling Price' />
                </div>
            </div>
            
            <div className='patient_details_input_field1_in_'>
                <div className='patient_details_input_field1_in' >
                    <h4>QUANTITY</h4>
                    <input value={quantity} onChange={(e)=>setquantity(e.target.value)} type='number'  placeholder='Enter Quantity' />
                </div>
                <div className='patient_details_input_field1_in' >
                    <h4>EXPIRING DATE</h4>
                    <input value={date} onChange={handleChange} type='date' />
                </div>
            </div>
            
            <div className='patient_details_input_field1_in_'>
                <div className='patient_details_input_field1_in' >
                    <h4>OS limit</h4>
                    <input value={limit} onChange={(e)=>setlimit(e.target.value)} type='number'  placeholder='Enter os limit' />
                </div>
                <div className='patient_details_input_field1_in' >
                    <h4>EXPIRING Limit</h4>
                    <input value={explimit} onChange={(e)=>setexplimit(e.target.value)} type='number' placeholder='Enter Expiring limit'/>
                </div>
            </div>

            
            <div className='patient_details_input_field1_' >
                <h4>DRUG CLASSIFICATION</h4>
                <select value={clas} onChange={(e)=>setclas(e.target.value)}>
                  <option >Select Drug Classification (Optional))</option>
                  <option value={'Antenatal'} >Antenatal</option>
                  <option value={'normal'} >normal</option>
                </select>
            </div>

            
            <button onClick={handleAddUtils} className='add_staff_contaimer_button' >UPLOAD UTILS</button>
          </div>

          
          <div className='payment_desk_input_fields add_utilities' >
            <h4>RECENTLY ADDED DRUGS | CONSUMABLES | UTILITIES</h4>
            <div className='display_all_utilities_contianer' style={{height:'100%'}} >
              <div className='display_all_utilities' >
                {
                  utilities?.length > 0 ?
                    utilities?.map((cat, i)=>{
                      
                    const date = new Date(Number(cat?.expireDate * 1000))
                    const day = date.getDate()
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()

                    return( 
                    <div key={i} >
                      <div>
                        <p>Name: {cat?.name}</p>
                        <p>Batch:  ({cat?.batch})</p>
                        <h4>Quantity: {cat?.quantity}</h4>
                        <p>Expires: {`${day}-${month}-${year}`}</p>
                        <p>Os Limit: {cat?.limit}</p>
                        <p>Expire Limit: {cat?.explimit}</p>
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
      </div>
    </div>
  )
}

export default AddUtils