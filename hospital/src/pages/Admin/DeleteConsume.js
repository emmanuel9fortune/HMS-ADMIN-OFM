import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectid } from '../../features/idSlice';
import axios from 'axios';
import { selectip } from '../../features/ipSlice'
import AdminBar from '../../components/AdminBar';
import { toast } from 'react-toastify';

//axios.defaults.withCredentials = true

function Paymentdesk() {
    const ip = useSelector(selectip)

  const id = useSelector(selectid)

  const [patients, setpatients] = useState([])
  const [staffs, setstaffs] = useState([])
  const [bills, setbills] = useState([])
  const [reload, setreload] = useState(0)

  const [checkOut, setcheckOut] = useState([])
  const cip = window.location.hostname

  const handleBills =async(id)=>{
    try {
      await axios.post(`http://${cip || 'localhost'}:7700/getbills`, { uid: id }).then((res)=>{
        //console.log(res);
        if(res.data.status === 'success'){
          setcheckOut(res.data.getpatientBills)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  
  
  useEffect(()=>{
    const controller = new AbortController()
    const func =async()=>{
      try {
          await axios.post(`http://${cip || 'localhost'}:7700/getPatientOnBill`,{ signal: controller.signal}).then((res)=>{
            //console.log(res);
            
            if(res.data.status === 'success'){
              setpatients(res.data.getpatients)
              setstaffs(res.data.getstaffs)
              setbills(res.data.getbills)
              setreload(0)
            }
          })
      } catch (error) {
        console.log(error);
      }
    }
    func()
    return ()=> controller.abort()
  },[id, reload, cip])

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


  const handleDelete =async(uid, id)=>{

    try {
        await axios.post(`http://${cip || 'localhost'}:7700/deleteConsume`, {uid, id}).then((res)=>{
            console.log(res);
            
            if(res.data.status === 'success'){
                setreload(reload + 1)
                toast.success('DELETED')
                handleBills(uid)
            }
        })
    } catch (error) {
        console.log(error);
    }
  }


  return (
    <div className='dashboard_container'>
        <AdminBar/>
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
                            <button onClick={()=>handleDelete(item?.uid, item?._id, getBill?.totalPrice, item?.type)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >DELETE REQUEST</button>
                              </div>
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
