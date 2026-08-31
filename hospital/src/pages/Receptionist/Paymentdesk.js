import React, { useEffect, useState } from 'react'
import SideBar from '../../components/SideBar';
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice'

//axios.defaults.withCredentials = true

function Paymentdesk() {
    const ip = useSelector(selectip)

  const id = useSelector(selectid)

  const [patients, setpatients] = useState([])
  const [staffs, setstaffs] = useState([])
  const [bills, setbills] = useState([])
  const [reload, setreload] = useState(0)
  const [mode, setmode] = useState('')
  const [mode2, setmode2] = useState('')
  const [mode3, setmode3] = useState('')

  const [checkOut, setcheckOut] = useState([])

  const handleBills =async(id)=>{
    try {
      await axios.post(`http://${'localhost'}:7700/getbills`, { uid: id }).then((res)=>{
        //console.log(res);
        if(res.data.status === 'success'){
          setcheckOut(res.data.getpatientBills)
          setmode('')
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  
  
  useEffect(()=>{
    const func =async()=>{
      try {
          await axios.post(`http://${'localhost'}:7700/getPatientOnBill`).then((res)=>{
            //console.log(res);
            
            if(res.data.status === 'success'){
              setpatients(res.data.getpatients)
              setstaffs(res.data.getstaffs)
              setbills(res.data.getbills)
              setreload(0)
              if(id?.uid){
                handleBills(id?.uid)
              }
            }
          })
      } catch (error) {
        console.log(error);
      }
    }
    func()
  },[id, reload, ip])

  const finallMode = mode ? mode : mode2 ? mode2 : mode3 ? mode3 : null

  const handleCheckOut =async(uid, billId)=>{
    try {
      await axios.post(`http://${'localhost'}:7700/patientCheckOut`, {
        uid,
        billId,
        mode: finallMode
      }).then((res)=>{
        if(res.data.status === 'success'){
          handleBills(uid)
          setreload(reload + 1)
          toast.success('PATIENT CHECKOUT SUCCESSFUL')
          setmode('')
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const checkLab = checkOut?.find((itm)=>itm.type.includes('lab'))
  const checkScan = checkOut?.find((itm)=>itm.type.includes('scan'))
  const check = checkOut?.find((itm)=> itm.type !== 'scan' && itm.type !== 'lab' )


  
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    let total = 0;

    checkOut.forEach(entry => {
        try {
        const parsed = JSON.parse(entry.services);

        // Case 1: Single object (e.g. scan)
        if (!Array.isArray(parsed) && parsed?.price) {
            total += parsed.price;

        // Case 2: Array of lab services
        } else if (Array.isArray(parsed)) {
            parsed.forEach(service => {
            if (service.price) {
                total += service.price;
            }
            });

        // Case 3: Pharmacy with .items array
        } else if (parsed?.items && Array.isArray(parsed.items)) {
            parsed.items.forEach(item => {
            if (item.totalPrice) {
                total += item.totalPrice;
            }
            });
        }

        } catch (e) {
        console.warn(`Failed to parse services for ID ${entry._id}`);
        }
    });

    setTotalPrice(total);
  }, [checkOut]);

      
  const totalFormatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
  }).format(totalPrice);

  const [deposit, setdeposit] = useState('')
  const [dep, setdep] = useState(false)
  const [deposit1, setdeposit1] = useState('')
  const [deposit2, setdeposit2] = useState('')

  const handleDeposit =async(id, uid, deps)=>{
    try {
      await axios.post(`http://${'localhost'}:7700/addDeposit`, {id, deposit, mode, deps}).then((res)=>{        
        if(res.data.status === 'success'){
          setreload(reload + 1)
          toast.success('DEPOSIT ADDED')
          handleBills(uid)
          setdeposit('')
          setdep(false)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeposit1 =async(id, uid, deps)=>{
    try {
      await axios.post(`http://${'localhost'}:7700/addDeposit`, {id, deposit1, mode: mode2, deps}).then((res)=>{        
        if(res.data.status === 'success'){
          setreload(reload + 1)
          toast.success('DEPOSIT ADDED')
          handleBills(uid)
          setdeposit1('')
          setdep(false)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeposit2 =async(id, uid, deps)=>{
    try {
      await axios.post(`http://${'localhost'}:7700/addDeposit`, {id, deposit2, mode: mode3, deps}).then((res)=>{        
        if(res.data.status === 'success'){
          setreload(reload + 1)
          toast.success('DEPOSIT ADDED')
          handleBills(uid)
          setdeposit2('')
          setdep(false)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='dashboard_container'>
        <SideBar/>
        <div className='dashboard_body'>
          <div className='payment_desk' >
            <h3>PAYMENT DESK</h3>

            <div className='payment_desk_cart_fields' >
              <h4>PATIENTS ON BILL</h4>
              {
                patients?.length > 0 ?
                  patients?.map((item, i)=>{
                    const getService = bills?.length > 0 ?  bills?.find((bil)=>bil?.uid === item?._id) : []
                    const getStaff = staffs?.length > 0 ? staffs?.find((stf)=>stf?._id === getService?.staffID) : []

                    return(
                      <div key={i} className='payment_desk_cart_fields_slides'>
                        <div>
                          <h4>{item?.name}</h4>
                          <p>Bills sent from {getStaff?.title}</p>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                          <button onClick={()=>handleBills(item?._id)} style={{backgroundColor:'#0463ca'}} >View Bills</button>
                        </div>
                      </div>
                    )
                  })
                : null
              }
            </div>
            
            <div className='payment_desk_cart_fields' >
              {
                checkOut?.length > 0 &&
                <h1 style={{margin:'15px 0', color:'green'}} >Total Bill {totalFormatted}</h1>
              }
              {
                check &&
                <h4>BILLS FROM PHARMACY</h4>
              }
              {
                checkOut?.length > 0 ?
                  checkOut?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                    const getBill = JSON.parse(item?.services) 


                    const formatted = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(getBill?.totalPrice);
                    const formatted2 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(getBill?.actualPrice);
                    const formatted3 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(getBill?.totalPrice - getBill?.actualPrice);
                    const formatted4 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(item?.deposit);
                    const formatted5 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(getBill?.totalPrice - item?.initialDeposit);
                    const formatted6 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(item?.initialDeposit);


                      return(
                        <div key={i}>
                          { 
                            item?.type !== 'lab' &&
                              item?.type !== 'scan' &&
                              <div className='payment_desk_checkout' >
                                {
                                  getBill?.items?.length > 0 ?
                                      getBill?.items?.map((item, i)=>{
                                        
                                      const formatted = new Intl.NumberFormat('en-NG', {
                                          style: 'currency',
                                          currency: 'NGN',
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 0
                                        }).format(item?.price);
                                        
                                        return(
                                          <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                            <div style={{width: '70%'}} >
                                              <h4 >{item?.name}</h4>
                                              <p>Sold For :</p>
                                            </div>
                                            
                                            <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                              <h4>{item?.quantity}</h4>
                                              <h4>{formatted}</h4>
                                            </div>
                                          </div>
                                      )})
                                  : null
                                }
                            
                                <div className='cart_checkout_price' >
                                  <h4 style={{margin:'7px 0'}}>ACTUAL PRICE</h4>
                                  <h4 style={{margin:'7px 0'}}>{formatted2}</h4>
                                </div>
                                  
                                <div className='cart_checkout_price' >
                                  <h4 style={{margin:'7px 0'}}>PROFIT</h4>
                                  <h4 style={{margin:'7px 0'}}>{formatted3}</h4>
                                </div>
                                
                                <div className='cart_checkout_price' >
                                  <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                  <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                                </div>
                                  
                                <div className='cart_checkout_price' >
                                  <p style={{margin:'7px 0'}}>ADD DEPOSIT</p>
                                  <input checked={dep} onChange={()=> dep ? setdep(false): setdep(true)} type='checkbox'  />
                                </div>
                                
                                {
                                  item?.deposit &&
                                  <div className='cart_checkout_price' >
                                    <h4 style={{margin:'7px 0'}}>Recent Deposit</h4>
                                    <h4 style={{margin:'7px 0'}}>{item?.deposit ? formatted4 : 0}</h4>
                                  </div>
                                }
                                  
                                {
                                  item?.deposit &&
                                  <div style={{margin:'5px 0'}} className='cart_checkout_price' >
                                    <h4>Amount Left</h4>
                                    <h4>{formatted5}</h4>
                                  </div>
                                }
                                
                                {
                                  item?.deposit &&
                                  <div className='cart_checkout_price' >
                                    <h4 style={{margin:'7px 0'}}>Recent Payment Method</h4>
                                    <h4 style={{margin:'7px 0'}}>{item?.mode}</h4>
                                  </div>
                                }

                                {
                                  item?.deposit &&
                                  <div className='cart_checkout_price' >
                                    <h3 style={{margin:'7px 0'}}>TOTAL DEPOSITS</h3>
                                    <h3 style={{margin:'7px 0'}}>{formatted6}</h3>
                                  </div>
                                }

                                {
                                  dep &&
                                  <div className='patient_details_input_field1_' >
                                    <h4>ENTER DEPOSIT AMOUNT</h4>
                                    <input placeholder='Enter Deposited Amount' type='number' value={deposit} onChange={(e)=>setdeposit(e.target.value)} />
                                  </div>
                                }
                                
                                <div className='patient_details_input_field1_' >
                                    <h4>CHOOSE METHOD</h4>
                                    <select value={mode} onChange={(e)=>[setmode(e.target.value), setmode2(''), setmode3('')]} >
                                      <option  value=''>-- SELECT PAYMENT METHOD ---</option>
                                      <option value='cash' >-- CASH ---</option>
                                      <option value='pos'>-- POS ---</option>
                                      <option value='transfer'>-- TRANSFER ---</option>
                                    </select>
                                </div>  

                                {
                                  getBill ?
                                  mode ?
                                  dep && deposit ?
                                  <button onClick={()=>handleDeposit(item?._id, item?.uid, item?.deposit)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >RECORD DEPOSIT</button>
                                  :
                                  <button onClick={()=>handleCheckOut(item?.uid, item?._id)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
                                  :
                                  <button onClick={()=> toast.error('ENTER PAYMENT METHOD')} style={{margin: '20px 0', width:'100%', opacity:.1}} className='custome_table_btn2' >CHECK OUT NOW</button>
                                  :
                                  null
                                }
                              </div>
                          }
                        </div>
                      )                    
                  })
                : null
              }

              {
                checkLab &&
                <h4>BILLS FROM LAB</h4>
              }
              {
                checkOut?.length > 0 ?
                  checkOut?.filter((itm)=>itm.type.includes('lab')).sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                    const getBill = JSON.parse(item?.services) 
                    const getTotal = getBill?.reduce((sum, item)=> sum + item.price, 0)

                    const formatted5 = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(getTotal);


                    const formatted4 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(item?.deposit);
                    const formatted7= new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(getBill?.totalPrice - item?.initialDeposit);
                    const formated6 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(item?.initialDeposit);

                      return(
                        <div key={i} className='payment_desk_checkout'>
                          {
                            getBill?.map((bil)=>{

                            const formatted6 = new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(bil?.price);

                              return(
                              <div key={i} >
                                  <div  style={{margin:'5px 0'}} className='cart_checkout_price' >
                                      
                                      <div style={{width: '70%'}} >
                                        <p>Test Type : {bil?.testname}</p>
                                      </div>
                                      
                                      <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                        <h4>{formatted6}</h4>
                                      </div>
                                  </div>
                                
                                  <div className='cart_checkout_price' >
                                    <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                    <h3 style={{margin:'7px 0'}}>{formatted5}</h3>
                                  </div>

                                  <div className='cart_checkout_price' >
                                    <p style={{margin:'7px 0'}}>ADD DEPOSIT</p>
                                    <input checked={dep} onChange={()=> dep ? setdep(false): setdep(true)} type='checkbox'  />
                                  </div>
                                  
                                  {
                                    item?.deposit &&
                                    <div className='cart_checkout_price' >
                                      <h4 style={{margin:'7px 0'}}>Recent Deposit</h4>
                                      <h4 style={{margin:'7px 0'}}>{item?.deposit ? formatted4 : 0}</h4>
                                    </div>
                                  }
                                  
                                {
                                  item?.deposit &&
                                  <div style={{margin:'5px 0'}} className='cart_checkout_price' >
                                    <h4>Amount Left</h4>
                                    <h4>{formatted7}</h4>
                                  </div>
                                }
                                
                                {
                                  item?.deposit &&
                                  <div className='cart_checkout_price' >
                                    <h4 style={{margin:'7px 0'}}>Recent Payment Method</h4>
                                    <h4 style={{margin:'7px 0'}}>{item?.mode}</h4>
                                  </div>
                                }

                                {
                                  item?.deposit &&
                                  <div className='cart_checkout_price' >
                                    <h3 style={{margin:'7px 0'}}>TOTAL DEPOSITS</h3>
                                    <h3 style={{margin:'7px 0'}}>{formated6}</h3>
                                  </div>
                                }

                                {
                                  dep &&
                                  <div className='patient_details_input_field1_' >
                                    <h4>ENTER DEPOSIT AMOUNT</h4>
                                    <input placeholder='Enter Deposited Amount' type='number' value={deposit1} onChange={(e)=>setdeposit1(e.target.value)} />
                                  </div>
                                }

                                <div className='patient_details_input_field1_' >
                                    <h4>CHOOSE METHOD</h4>
                                  <select value={mode2} onChange={(e)=>[setmode2(e.target.value), setmode(''), setmode3('')]} >
                                    <option value=''>-- SELECT PAYMENT MODE ---</option>
                                    <option value='cash' >-- CASH ---</option>
                                    <option value='pos'>-- POS ---</option>
                                    <option value='transfer'>-- TRANSFER ---</option>
                                  </select>
                                </div>
                              </div>
                            )})
                          }

                          {
                            getBill ?
                            mode2 ?
                            dep && deposit1 ?
                            <button onClick={()=>handleDeposit1(item?._id, item?.uid, item?.deposit)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >RECORD DEPOSIT</button>
                            :
                            <button onClick={()=>handleCheckOut(item?.uid, item?._id)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
                            :
                            <button onClick={()=> toast.error('ENTER PAYMENT MODE')} style={{margin: '20px 0', width:'100%', opacity:.3}} className='custome_table_btn2' >CHECK OUT NOW</button>
                            :
                            null
                          }
                        </div>
                      )                    
                  })
                : null
              }

              {
                checkScan &&
                <h4>BILLS FROM SCAN</h4>
              }
              {
                checkOut?.length > 0 ?
                  checkOut?.filter((itm)=>itm.type.includes('scan')).sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                    const getBill = JSON.parse(item?.services) 

                    
                    const formatted4 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(item?.deposit);
                    const formatted7= new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(getBill?.totalPrice - item?.initialDeposit);
                    const formated6 = new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(item?.initialDeposit);

                    const formatted5 = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(getBill?.price);

                      return(
                        <div key={i} className='payment_desk_checkout'>
                          <div  style={{margin:'5px 0'}} className='cart_checkout_price' >
                            <div style={{width: '70%'}} >
                              <p>Test Type : {getBill?.testname}</p>
                            </div>
                            
                            <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                              <h4>{formatted5}</h4>
                            </div>
                          </div>
                        
                          <div className='cart_checkout_price' >
                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                            <h3 style={{margin:'7px 0'}}>{formatted5}</h3>
                          </div>                 
                            

                          <div className='cart_checkout_price' >
                            <p style={{margin:'7px 0'}}>ADD DEPOSIT</p>
                            <input checked={dep} onChange={()=> dep ? setdep(false): setdep(true)} type='checkbox'  />
                          </div>
                          
                          {
                            item?.deposit &&
                            <div className='cart_checkout_price' >
                              <h4 style={{margin:'7px 0'}}>Recent Deposit</h4>
                              <h4 style={{margin:'7px 0'}}>{item?.deposit ? formatted4 : 0}</h4>
                            </div>
                          }
                          
                          {
                            item?.deposit &&
                            <div style={{margin:'5px 0'}} className='cart_checkout_price' >
                              <h4>Amount Left</h4>
                              <h4>{formatted7}</h4>
                            </div>
                          }
                                  
                          {
                            item?.deposit &&
                            <div className='cart_checkout_price' >
                              <h4 style={{margin:'7px 0'}}>Recent Payment Method</h4>
                              <h4 style={{margin:'7px 0'}}>{item?.mode}</h4>
                            </div>
                          }

                          {
                            item?.deposit &&
                            <div className='cart_checkout_price' >
                              <h3 style={{margin:'7px 0'}}>TOTAL DEPOSITS</h3>
                              <h3 style={{margin:'7px 0'}}>{formated6}</h3>
                            </div>
                          }

                          {
                            dep &&
                            <div className='patient_details_input_field1_' >
                              <h4>ENTER DEPOSIT AMOUNT</h4>
                              <input placeholder='Enter Deposited Amount' type='number' value={deposit2} onChange={(e)=>setdeposit2(e.target.value)} />
                            </div>
                          }

                          <div className='patient_details_input_field1_' >
                              <h4>CHOOSE METHOD</h4>
                            <select value={mode3} onChange={(e)=>[setmode3(e.target.value), setmode(''), setmode2('')]} >
                              <option value=''>-- SELECT PAYMENT MODE ---</option>
                              <option value='cash' >-- CASH ---</option>
                              <option value='pos'>-- POS ---</option>
                              <option value='transfer'>-- TRANSFER ---</option>
                            </select>     
                          </div>    
                           
                          {
                            getBill ?
                            mode3 ?
                            dep && deposit2 ?
                            <button onClick={()=>handleDeposit2(item?._id, item?.uid, item?.deposit)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >RECORD DEPOSIT</button>
                            :
                            <button onClick={()=>handleCheckOut(item?.uid, item?._id)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
                            :
                            <button onClick={()=> toast.error('ENTER PAYMENT MODE')} style={{margin: '20px 0', width:'100%', opacity:.3}} className='custome_table_btn2' >CHECK OUT NOW</button>
                            :
                            null
                          }
                        </div>
                      )                    
                  })
                : null
              }
            </div> 
          </div>
        </div>
    </div>
  )
}

export default Paymentdesk;
