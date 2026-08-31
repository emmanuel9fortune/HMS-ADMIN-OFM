import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import { FaChevronLeft } from 'react-icons/fa'
import { selectid } from '../../features/idSlice'

function TransactionHistory({ handleBack, setCurrentIndex, currenIndex }) {
    const ip = useSelector(selectip)

    const [getPending, setgetPending] = useState([])
    const [getComplete, setgetComplete] = useState([])
    
      const id = useSelector(selectid)
      const uid = id?.id

    useEffect(()=>{
        const func =async()=>{            
            try {
                await axios.post(`http://${'localhost'}:7700/patientTransactions`, {uid}).then((res)=>{
                    //console.log(res);
                    
                    if(res.data.status === 'success'){
                        setgetPending(res.data.pendingBills)
                        setgetComplete(res.data.paidBlls)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
    },[uid, ip])
    
    
  const checkLab = getComplete?.find((itm)=>itm.type === 'lab')
  const checkScan = getComplete?.find((itm)=>itm.type === 'scan')
  const check = getComplete?.find((itm)=> itm.type !== 'scan' && itm.type !== 'lab' )
    
  const checkLab1 = getPending?.find((itm)=>itm.type === 'lab')
  const checkScan1 = getPending?.find((itm)=>itm.type === 'scan')
  const check1 = getPending?.find((itm)=> itm.type !== 'scan' && itm.type !== 'lab' )


    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        let total = 0;

        getComplete.forEach((entry) => {
            try {
            const parsed = JSON.parse(entry.services);

            // Case 1: Array (lab services)
            if (Array.isArray(parsed)) {
                parsed.forEach(service => {
                if (service.totalPrice) {
                    total += service.totalPrice;
                } else if (service.price) {
                    total += service.price;
                }
                });

            // Case 2: Object with .items (pharmacy)
            } else if (parsed?.items) {
                parsed.items.forEach(item => {
                if (item.totalPrice) {
                    total += item.totalPrice;
                }
                });
            }else if (parsed && typeof parsed === 'object') {
                if (parsed.totalPrice) {
                total += parsed.totalPrice;
                } else if (parsed.actualPrice) {
                total += parsed.actualPrice;
                } else if (parsed.price) {
                total += parsed.price;
                }
            }


            } catch (e) {
            console.warn(`Invalid JSON in services for ID ${entry._id}`);
            }
        });

        setTotalPrice(total);
    }, [getComplete]); 


    // ============================================================= //
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ============================================================= //

    const [totalPrice1, setTotalPrice1] = useState(0)

    useEffect(() => {
        let total = 0;

        getPending.forEach(entry => {
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

        setTotalPrice1(total);
    }, [getPending]);

    // ============================================================= //
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ============================================================= //
    
    const totalFormatted = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(totalPrice);
    
    const totalFormatted1 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(totalPrice1);

  

  return (
    <div className='dashboard_body' >

        <div className='back_btn_' onClick={handleBack}>
            <FaChevronLeft />
            <h4>BACK</h4>
        </div>
        
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setCurrentIndex(0)}>PATIENT DETAILS</button>
            <button onClick={()=>setCurrentIndex(1)} >VITALS</button>
            <button onClick={()=>setCurrentIndex(2)}>LAB RESULTS | SCAN</button>
            <button onClick={()=>setCurrentIndex(3)}>PRESCRIPTION</button>
            <button onClick={()=>setCurrentIndex(5)}>MEDICATION CHART</button>
            <button className={currenIndex === 4 && 'dashboard_body_patient_details_btns_'}>TRANSACTION HISTORY</button>
        </div>
        <div className='payment_desk' >
            <h3>COMPLETED TRANSACTION HISTORY</h3>

            <div className='payment_desk_cart_fields' >
                <div style={{padding:'10px 0', borderBottom:'.3px solid #c3c3c3', color:'green'}}>
                    <h4>Total Income Made {totalFormatted}</h4>
                </div>                  
                {
                    check &&
                    <h4 style={{margin:'10px 0 0 0 '}} >BILLS FROM PHARMACY</h4>
                }
                {   
                    getComplete?.length > 0 ?
                    getComplete?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                        const getBill = JSON.parse(item?.services) 
                        const profit = getBill?.totalPrice - getBill?.actualPrice
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
                        }).format(profit);

                        const date = new Date(Number(item?.timeStamp))
                        const day = date.getDate()
                        const month = date.getMonth()
                        const year = date.getFullYear()
                        const date1 = new Date(Number(item?.timeStamp))

                        let hours = date1.getHours()
                        const minutes = date1.getMinutes()
                        const ampm = hours >= 12 ? "PM" : "AM"

                        hours = hours % 12
                        hours = hours ? hours : 12

                        const pad = (n) => n.toString().padStart(2, '0')

                        const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                        return(
                            <div key={i} className='payment_desk_checkout'>
                                { 
                                    item?.type !== 'lab' &&
                                    item?.type !== 'scan' &&
                                    <div  >
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
                                            <p></p>
                                            <h3>PAID BY: {item?.mode}</h3>
                                        </div>   
                                    </div>
                                }
                                {
                                    item?.type !== 'lab' &&
                                    item?.type !== 'scan' &&
                                    <div className='psyment_desk_history' >
                                        <p>Date : </p>
                                        <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                    </div>
                                }
                            </div>
                        )                    
                    })
                    : null
                }

                {
                    checkLab &&
                    <h4 style={{margin:'15px 0 0 0'}}  >BILLS FROM LAB</h4>
                }
                {   
                    getComplete?.length > 0 ?
                    getComplete?.filter((itm)=>itm?.type === 'lab').sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                        const getBill = JSON.parse(item?.services) 
                        const getTotal = getBill?.reduce((sum, item)=> sum + item.price, 0)

                        const formatted5 = new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(getTotal);


                        const date = new Date(Number(item?.timeStamp))
                        const day = date.getDate()
                        const month = date.getMonth()
                        const year = date.getFullYear()
                        const date1 = new Date(Number(item?.timeStamp))

                        let hours = date1.getHours()
                        const minutes = date1.getMinutes()
                        const ampm = hours >= 12 ? "PM" : "AM"

                        hours = hours % 12
                        hours = hours ? hours : 12

                        const pad = (n) => n.toString().padStart(2, '0')

                        const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

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
                                            <p></p>
                                            <h3>PAID BY: {item?.mode}</h3>
                                        </div>   
                                    </div>
                                    )})
                                }
                                <div className='psyment_desk_history' >
                                    <p>Date : </p>
                                    <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                </div>
                            </div>
                        )                    
                    })
                    : null
                }

                {
                    checkScan &&
                    <h4 style={{margin:'15px 0'}} >BILLS FROM SCAN</h4>
                }

                {
                    getComplete?.length > 0 ?
                    getComplete?.filter((itm)=>itm.type === 'scan').sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                        const getBill = JSON.parse(item?.services) 

                        const formatted5 = new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(getBill?.price);
                        
                        const date = new Date(Number(item?.timeStamp))
                        const day = date.getDate()
                        const month = date.getMonth()
                        const year = date.getFullYear()
                        const date1 = new Date(Number(item?.timeStamp))

                        let hours = date1.getHours()
                        const minutes = date1.getMinutes()
                        const ampm = hours >= 12 ? "PM" : "AM"

                        hours = hours % 12
                        hours = hours ? hours : 12

                        const pad = (n) => n.toString().padStart(2, '0')

                        const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

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
                                    <p></p>
                                    <h3>PAID BY: {item?.mode}</h3>
                                </div>   

                                <div className='psyment_desk_history' >
                                    <p>Date : </p>
                                    <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                </div>                       
                            </div>
                        )                    
                    })
                    : null
                }
            </div>

            <div className='payment_desk_cart_fields' >
            
                <div style={{padding:'10px 0', borderBottom:'.3px solid #c3c3c3', color:'red'}}>
                    <h4>Total Pending Transactions Income {totalFormatted1}</h4>
                </div> 
                {
                    check1 &&
                    <h4 style={{margin:'15px 0 0 0 '}}>BILLS FROM PHARMACY</h4>
                }
                {
                    getPending?.length > 0 ?
                    getPending?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
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
                        }).format(getBill?.actualPrice);

                        
                        const date = new Date(Number(item?.timeStamp))
                        const day = date.getDate()
                        const month = date.getMonth()
                        const year = date.getFullYear()
                        const date1 = new Date(Number(item?.timeStamp))

                        let hours = date1.getHours()
                        const minutes = date1.getMinutes()
                        const ampm = hours >= 12 ? "PM" : "AM"

                        hours = hours % 12
                        hours = hours ? hours : 12

                        const pad = (n) => n.toString().padStart(2, '0')

                        const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

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
                                        <h3 style={{margin:'7px 0'}}>ACTUAL PRICE</h3>
                                        <h3 style={{margin:'7px 0'}}>{formatted2}</h3>
                                        </div>
                                        
                                        <div className='cart_checkout_price' >
                                        <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                        <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                                        </div>
                                        
                                        <div className='cart_checkout_price' >
                                        <h3 style={{margin:'7px 0'}}>PROFIT</h3>
                                        <h3 style={{margin:'7px 0'}}>{formatted3}</h3>
                                        </div>

                                        <p></p>
                                    </div>
                                }  
                                {
                                    item?.type !== 'lab' && item?.type !== 'scan' &&
                                    <div className='psyment_desk_history' >
                                        <p>Date : </p>
                                        <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                    </div>   
                                }
                            </div>
                        )                    
                    })
                    : null
                }

                {
                    checkLab1 &&
                    <h4 style={{margin:'15px 0 0 0 '}}>BILLS FROM LAB</h4>
                }
                {
                    getPending?.length > 0 ?
                    getPending?.filter((itm)=>itm.type.includes('lab')).sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                        const getBill = JSON.parse(item?.services) 
                        const getTotal = getBill?.reduce((sum, item)=> sum + item.price, 0)

                        const formatted5 = new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(getTotal);


                        const date = new Date(Number(item?.timeStamp))
                        const day = date.getDate()
                        const month = date.getMonth()
                        const year = date.getFullYear()
                        const date1 = new Date(Number(item?.timeStamp))

                        let hours = date1.getHours()
                        const minutes = date1.getMinutes()
                        const ampm = hours >= 12 ? "PM" : "AM"

                        hours = hours % 12
                        hours = hours ? hours : 12

                        const pad = (n) => n.toString().padStart(2, '0')

                        const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

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
                                            <p></p>
                                            <h3>PAID BY: {item?.mode}</h3>
                                        </div>   
                                    </div>
                                    )})
                                }
                                {
                                    getBill?.length > 0 &&
                                    <div className='psyment_desk_history' >
                                        <p>Date : </p>
                                        <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                    </div>  
                                } 
                            </div>
                        )                    
                    })
                    : null
                }

                {
                    checkScan1 &&
                    <h4 style={{margin:'15px 0 0 0 '}} >BILLS FROM SCAN</h4>
                }
                {
                    getPending?.length > 0 ?
                    getPending?.filter((itm)=>itm.type.includes('scan')).sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{
                        const getBill = JSON.parse(item?.services) 

                        const formatted5 = new Intl.NumberFormat('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(getBill?.price);

                        const date = new Date(Number(item?.timeStamp))
                        const day = date.getDate()
                        const month = date.getMonth()
                        const year = date.getFullYear()
                        const date1 = new Date(Number(item?.timeStamp))

                        let hours = date1.getHours()
                        const minutes = date1.getMinutes()
                        const ampm = hours >= 12 ? "PM" : "AM"

                        hours = hours % 12
                        hours = hours ? hours : 12

                        const pad = (n) => n.toString().padStart(2, '0')

                        const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

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
                                
                                <p></p>


                                <div className='psyment_desk_history' >
                                    <p>Date : </p>
                                    <p style={{margin:'0 10px'}} >{timeString}, {`${day}-${month}-${year}`}</p>
                                </div>                            
                            </div>
                        )                    
                    })
                    : null
                }
            </div>
        </div>
    </div>
  )
}

export default TransactionHistory