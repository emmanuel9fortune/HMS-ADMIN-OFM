import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AdminBar from '../../components/AdminBar'
import Audits from './Audits'
import Expenses from './Expenses'

function TransactionHistory() {

    const [getPending, setgetPending] = useState([])
    const [getComplete, setgetComplete] = useState([])
    const [getPatient, setgetPatient] = useState([])
    const [date, setdate] = useState('')
    const [enddate, setenddate] = useState('')
    const [xdate, setxdate] = useState('')

    useEffect(()=>{
        const toady = new Date()
        const formattedDate = toady.toISOString().split('T')[0]
        setxdate(formattedDate)
        const setToday = new Date().setHours(0, 0, 0, 0)
        const now = Date.now()
        setdate(setToday);
        setenddate(now);
    },[])

    const [sort, setsort] = useState('')
    const cip = window.location.hostname

    useEffect(()=>{
    const controller = new AbortController()
        const func =async()=>{             
            try {
                await axios.post(`http://${cip || 'localhost'}:7700/History`, {unix: date, eunix: enddate, sorts: sort, signal: controller.signal}).then((res)=>{
                    ////console.log(res);
                    
                    if(res.data.status === 'success'){
                        setgetPending(res.data.pendingBills)
                        setgetPatient(res.data.getPatients)
                        setgetComplete(res.data.paidBlls)
                    }
                })
            } catch (error) {
                //console.log(error);
            }
        }
        func()
        return ()=> controller.abort()
    },[date, enddate, sort, cip])

    const handleDate = (e) => {
        const raw = e.target.value;
        setxdate(raw);

        const start = new Date(raw);
        const end = new Date(raw);
        end.setHours(23, 59, 59, 999);

        setdate(start.getTime());
        setenddate(end.getTime());
    };
    
    
  const checkLab = getComplete?.find((itm)=>itm.type === 'lab')
  const checkScan = getComplete?.find((itm)=>itm.type === 'scan')
  const check = getComplete?.find((itm)=> itm.type !== 'scan' && itm.type !== 'lab' )
    
  const checkLab1 = getPending?.find((itm)=>itm.type === 'lab')
  const checkScan1 = getPending?.find((itm)=>itm.type === 'scan')
  const check1 = getPending?.find((itm)=> itm.type !== 'scan' && itm.type !== 'lab' )


    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        let total = 0;

        getComplete?.forEach((entry) => {
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

    const handlePeriod =(e) => {
        const raw = e.target.value;
        const now = Date.now()

        const DaysAgo = now - raw * 24 * 60 * 60 * 1000

        setdate(DaysAgo);
        setenddate(now);
    }

    const handleService=(e)=>{
        setsort(e.target.value)
    }

    const handlePeriodByMonth = async(e) => {
        const month = Number(e.target.value);
        const year = new Date().getFullYear();

        const start = new Date(year, month - 1, 1).getTime();
        const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        setdate(start);
        setenddate(end);
        setsort(prev => prev); // ensure sort is preserved
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${cip || 'localhost'}:7700/History/month`, { year, month, sorts: sort })
        .then(res => {
            if (res.data.status === 'success') {
                setgetPending(res.data.pendingBills);
                setgetPatient(res.data.patients);
                setgetComplete(res.data.paidBills);
            }
        });
    };

    const handlePeriodByMonth1 = async(e) => {
        const month = Number(e);
        const year = new Date().getFullYear();        

        const start = new Date(year, month - 1, 1).getTime();
        const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        setdate(start);
        setenddate(end);
        setsort(prev => prev); // ensure sort is preserved
        // Then fetch uses effect or you can call manually:
        await axios.post(`http://${cip || 'localhost'}:7700/History/month`, { year, month, sorts: sort })
        .then(res => {
            if (res.data.status === 'success') {
                setgetPending(res.data.pendingBills);
                setgetPatient(res.data.patients);
                setgetComplete(res.data.paidBills);
            }
        });
    };

  
    const [count, setcount] = useState(0)

  return (
    <div className='dashboard_container'>
        <AdminBar/>
        <div className='dashboard_body' >
          <div style={{width:'fit-content', borderRadius:'999px', border:'1px solid grey', padding:'5px'}} >
              <button style={count !== 0 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(0)}>PAYMENT DESK</button>
              <button style={count !== 1 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(1)}>AUDITS</button>
              <button style={count !== 2 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(2)}>EXPENSES</button>
          </div>

          {
            count === 0 &&
            <div className='payment_desk' >
                <h3>COMPLETED TRANSACTION HISTORY</h3>

                <div className='payment_desk_cart_fields' >

                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE DATE</h4>
                        <input value={xdate} onChange={handleDate} type='date' />
                    </div>  
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE PERIOD</h4>
                        <select onChange={handlePeriod} >
                            <option value={7} >SELECT PERIOD</option>
                            <option value={7} >LAST WEEK</option>
                            <option value={31} >LAST MONTH </option>
                            <option value={62}>LAST TWO MONTH</option>
                            <option value={186}>LAST SIX MONTHS</option>
                            <option value={356}>YEAR</option>
                        </select>
                    </div>
                </div>
                <div className='patient_details_input_field1_in_'>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE MONTH</h4>
                        <select onChange={handlePeriodByMonth} >
                            <option value={1}>SELECT MONTH</option>
                            <option value={1}>JANUARY</option>
                            <option value={2}>FEBUARY</option>
                            <option value={3}>MARCH</option>
                            <option value={4}>APRIL</option>
                            <option value={5}>MAY</option>
                            <option value={6}>JUNE</option>
                            <option value={7}>JULY</option>
                            <option value={8}>AUGUST</option>
                            <option value={9}>SEPTEMBER</option>
                            <option value={10}>OCTOBER</option>
                            <option value={11}>NOVEMBER</option>
                            <option value={12}>DECEMBER</option>
                        </select>

                    </div>
                    <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                        <h4>CHOOSE UTILITIES | SERVICES</h4>
                        <select onChange={handleService} >
                            <option >ALL</option>
                            <option value={'drugs'} >DRUGS</option>
                            <option value={'utils'}>UTILITIES | CONSUMABLES</option>
                            <option value={'lab'} >TESTS</option>
                            <option value={'scan'}>SCANS</option>
                        </select>
                    </div>
                </div>

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
                            const month = date.getMonth() + 1
                            const year = date.getFullYear()
                            const date1 = new Date(Number(item?.timeStamp))

                            let hours = date1.getHours()
                            const minutes = date1.getMinutes()
                            const ampm = hours >= 12 ? "PM" : "AM"

                            hours = hours % 12
                            hours = hours ? hours : 12

                            const pad = (n) => n.toString().padStart(2, '0')

                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                            return(
                                <div key={i} >
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
                                                            <h4 >{item?.name || item?.drugs}</h4>
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
                                                                                    
                                            {
                                                getBill?.actualPrice &&
                                                <div className='cart_checkout_price' >
                                                    <h4 style={{margin:'7px 0'}}>ACTUAL PRICE</h4>
                                                    <h4 style={{margin:'7px 0'}}>{formatted2}</h4>
                                                </div>
                                            }

                                            {
                                                getBill?.actualPrice &&
                                                <div className='cart_checkout_price' >
                                                    <h4 style={{margin:'7px 0'}}>PROFIT</h4>
                                                    <h4 style={{margin:'7px 0'}}>{formatted3}</h4>
                                                </div>
                                            }

                                            <div className='cart_checkout_price' >
                                                <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                                <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                                            </div>

                                            <div className='cart_checkout_price' >
                                                <p>Bill Paid by <strong>( {item?.name || patient?.name} )</strong></p>
                                                <h3>PAID BY: {item?.mode}</h3>
                                            </div>   
                                        </div>
                                    }
                                    {
                                        item?.type !== 'lab' &&
                                        item?.type !== 'scan' &&
                                        <div className='psyment_desk_history' style={{margin:'5px 0'}} >
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
                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(getTotal);


                            const date = new Date(Number(item?.timeStamp))
                            const day = date.getDate()
                            const month = date.getMonth() + 1
                            const year = date.getFullYear()
                            const date1 = new Date(Number(item?.timeStamp))

                            let hours = date1.getHours()
                            const minutes = date1.getMinutes()
                            const ampm = hours >= 12 ? "PM" : "AM"

                            hours = hours % 12
                            hours = hours ? hours : 12

                            const pad = (n) => n.toString().padStart(2, '0')

                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                            return(
                                <div key={i} className='payment_desk_checkout'>
                                    {   getBill?.length > 0 ?
                                        getBill?.map((bil)=>{

                                        const formatted6 = new Intl.NumberFormat('en-NG', {
                                            style: 'currency',
                                            currency: 'NGN',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(bil?.price);

                                        return(
                                        <div key={i} className='payment_desk_checkout' >
                                            <div  style={{margin:'5px 0'}} className='cart_checkout_price' >
                                                
                                                <div style={{width: '70%'}} >
                                                    <p>Test Type : {bil?.testname}</p>
                                                </div>
                                                
                                                <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                                    <h4>{formatted6}</h4>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        )})
                                        : null
                                    }
                                    
                                    <div className='cart_checkout_price' >
                                        <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                        <h3 style={{margin:'7px 0'}}>{formatted5}</h3>
                                    </div>

                                    <div className='cart_checkout_price' >
                                        <p>Bill Paid by <strong>( {patient?.name} )</strong></p>
                                        <h3>PAID BY: {item?.mode}</h3>
                                    </div>   
                                    <div className='psyment_desk_history' style={{margin:'5px 0'}} >
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
                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(getTotal);
                            
                            const date = new Date(Number(item?.timeStamp))
                            const day = date.getDate()
                            const month = date.getMonth() + 1
                            const year = date.getFullYear()
                            const date1 = new Date(Number(item?.timeStamp))

                            let hours = date1.getHours()
                            const minutes = date1.getMinutes()
                            const ampm = hours >= 12 ? "PM" : "AM"

                            hours = hours % 12
                            hours = hours ? hours : 12

                            const pad = (n) => n.toString().padStart(2, '0')

                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                            return(
                                <div key={i} className='payment_desk_checkout'>
                                    {
                                    getBill?.length > 0 ?
                                        getBill?.map((items, i)=>{
                                        const formatted = new Intl.NumberFormat('en-NG', {
                                            style: 'currency',
                                            currency: 'NGN',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                            }).format(items?.price);
                                            
                                            return(
                                            <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                                <div style={{width: '70%'}} >
                                                <p>Scan Type :</p>
                                                <h4 >{items?.testname}</h4>
                                                </div>
                                                
                                                <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                                <h4>{formatted}</h4>
                                                </div>
                                            </div>
                                        )})
                                    : null
                                    }
                                    
                                    <div className='cart_checkout_price' >
                                        <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                        <h3 style={{margin:'7px 0'}}>{formatted5}</h3>
                                    </div>     

                                    <div className='cart_checkout_price' >
                                        <p>Bill Paid by <strong>( {patient?.name} )</strong></p>
                                        <h3>PAID BY: {item?.mode}</h3>
                                    </div>   

                                    <div className='psyment_desk_history' style={{margin:'5px 0'}} >
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
                            const month = date.getMonth() + 1
                            const year = date.getFullYear()
                            const date1 = new Date(Number(item?.timeStamp))

                            let hours = date1.getHours()
                            const minutes = date1.getMinutes()
                            const ampm = hours >= 12 ? "PM" : "AM"

                            hours = hours % 12
                            hours = hours ? hours : 12

                            const pad = (n) => n.toString().padStart(2, '0')

                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 


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
                                                            <h4 >{item?.name || item?.drugs}</h4>
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
                                        
                                            {
                                                getBill?.actualPrice&&
                                                <div className='cart_checkout_price' >
                                                    <h3 style={{margin:'7px 0'}}>ACTUAL PRICE</h3>
                                                    <h3 style={{margin:'7px 0'}}>{formatted2}</h3>
                                                </div>
                                            }
                                            
                                            <div className='cart_checkout_price' >
                                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                            <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                                            </div>
                                            
                                            { getBill?.actualPrice&&
                                                <div className='cart_checkout_price' >
                                                    <h3 style={{margin:'7px 0'}}>PROFIT</h3>
                                                    <h3 style={{margin:'7px 0'}}>{formatted3}</h3>
                                                </div>
                                            }

                                            <p>Bill to be PAid by <strong>( {patient?.name} )</strong></p>
                                        </div>
                                    }  
                                    {
                                        item?.type !== 'lab' && item?.type !== 'scan' &&
                                        <div className='psyment_desk_history' style={{margin:'5px 0'}} >
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
                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(getTotal);


                            const date = new Date(Number(item?.timeStamp))
                            const day = date.getDate()
                            const month = date.getMonth() + 1
                            const year = date.getFullYear()
                            const date1 = new Date(Number(item?.timeStamp))

                            let hours = date1.getHours()
                            const minutes = date1.getMinutes()
                            const ampm = hours >= 12 ? "PM" : "AM"

                            hours = hours % 12
                            hours = hours ? hours : 12

                            const pad = (n) => n.toString().padStart(2, '0')

                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                            return(
                                <div key={i} >
                                    {
                                        getBill?.map((bil, index)=>{

                                        const formatted6 = new Intl.NumberFormat('en-NG', {
                                            style: 'currency',
                                            currency: 'NGN',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        }).format(bil?.price);

                                        return(
                                        <div key={index} className='payment_desk_checkout'>
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
                                                <p>Bill to be PAid by <strong>( {patient?.name} )</strong></p>
                                            </div>   
                                        </div>
                                        )})
                                    }
                                    {
                                        getBill?.length > 0 &&
                                        <div className='psyment_desk_history' style={{margin:'5px 0'}} >
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
                            const getTotal = getBill?.length > 0  ? getBill?.reduce((sum, item)=> sum + item.price, 0) : 0

                            const formatted5 = new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(getTotal);

                            const date = new Date(Number(item?.timeStamp))
                            const day = date.getDate()
                            const month = date.getMonth() + 1
                            const year = date.getFullYear()
                            const date1 = new Date(Number(item?.timeStamp))

                            let hours = date1.getHours()
                            const minutes = date1.getMinutes()
                            const ampm = hours >= 12 ? "PM" : "AM"

                            hours = hours % 12
                            hours = hours ? hours : 12

                            const pad = (n) => n.toString().padStart(2, '0')

                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                            const patient = getPatient?.find((pat)=> pat?._id === item?.uid) 

                            return(
                                <div key={i} className='payment_desk_checkout'>
                                    {
                                    getBill?.length > 0 ?
                                        getBill?.map((items, i)=>{
                                        const formatted = new Intl.NumberFormat('en-NG', {
                                            style: 'currency',
                                            currency: 'NGN',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                            }).format(items?.price);
                                            
                                            return(
                                            <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                                <div style={{width: '70%'}} >
                                                <p>Scan Type :</p>
                                                <h4 >{items?.testname}</h4>
                                                </div>
                                                
                                                <div style={{width: '30%', display:'flex', flexDirection:'column', alignItems:'flex-end'}} >
                                                <h4>{formatted}</h4>
                                                </div>
                                            </div>
                                        )})
                                    : null
                                    }
                                    
                                    <div className='cart_checkout_price' >
                                        <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                        <h3 style={{margin:'7px 0'}}>{formatted5}</h3>
                                    </div>   
                                    
                                    <p>Bill to be PAid by <strong>( {patient?.name} )</strong></p>


                                    <div className='psyment_desk_history' style={{margin:'5px 0'}} >
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
          }

          {
            count === 1 &&
            <Audits setenddate1={setenddate} setdate1={setdate} getPending1={getPending} setsort1={setsort} getPatient1={getPatient} handlePeriodByMonth1={handlePeriodByMonth1} />
          }

          {
            count === 2 &&
            <Expenses/>
          }
        </div>
    </div>
  )
}

export default TransactionHistory