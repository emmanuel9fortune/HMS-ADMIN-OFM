import React, { use, useEffect, useState } from 'react'
import { FaChevronLeft, FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { selectip } from '../../features/ipSlice'
import axios from 'axios'
import { emptyCart, selectCartactualPrice, selectCartTotalPrice } from '../../features/cartSlice'
import { toast } from 'react-toastify'
import { selectid } from '../../features/idSlice'
import UtilsCard from './UtilsCard'

function DispanseUtils({handleBack, currentIndex, setcurrentIndex}) {

    const ip = useSelector(selectip)
    
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

                const response = await axios.post(`http://${'localhost'}:7700/nurseSearch`, value);
                setsearch(response.data.utils)                 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

    const cartItems = useSelector(state => state.cart.items);

    const [utils, setutils] = useState([])
    const [reload, setreload] = useState(0)

    useEffect(()=>{
        const func =async()=>{
            try {
                await axios.post(`http://${'localhost'}:7700/nurseUtils`).then((res)=>{                
                    if(res.data.status === 'success'){
                        setutils(res.data.utils)
                        setreload(0)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
    },[ip, reload])
      
    const totalPrice = useSelector(selectCartTotalPrice);

    const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
    }).format(totalPrice);
    
    const actualPrice = useSelector(selectCartactualPrice);

    const formatted2 = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
    }).format(actualPrice);

    const profit = totalPrice - actualPrice

    const formatted3 = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
    }).format(profit);

    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)
    
    const id = useSelector(selectid);
    const uid = id?.id;

    const dispatch = useDispatch()

    const handleSubmit=async()=>{
        const getservices = {
            totalPrice: totalPrice,
            actualPrice: actualPrice, 
            profit: profit,
            items: cartItems
        }
        const value ={
            uid ,
            nurseID: getid?._id,
            services: JSON.stringify(getservices),
            cartItems
        }

        try {
            await axios.post(`http://${'localhost'}:7700/nurseBill`, value).then((res)=>{                
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    localStorage.removeItem('cart')
                    dispatch(emptyCart())
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const [dispenseIndex, setdispenseIndex] = useState(0) 
    const [getitems, setgetitems] = useState([])
    const [getStaff, setgetStaff] = useState([])

    useEffect(()=>{
        const func=async()=>{
            await axios.post(`http://${'localhost'}:7700/getItems`, {uid}).then((res)=>{
                console.log(res);
                
                if(res.data.status === 'success'){
                    setgetitems(res.data.getpatientItems)
                    setgetStaff(res.data.getStaff)
                    setreload(0)
                    setdispenseIndex(dispenseIndex)
                }
            })
        }

        func()
    },[uid, ip, reload, dispenseIndex])
    

  return (
    <div className="dashboard_body">
        <div className="back_btn_" onClick={handleBack}>
            <FaChevronLeft />
            <h4>BACK</h4> 
        </div>

        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setcurrentIndex(1)}>PATIENT DETAILS</button> 
            <button onClick={()=>setcurrentIndex(2)}>PATIENT VITALS</button> 
            <button className={currentIndex === 3 && 'dashboard_body_patient_details_btns_'} >UTILITIES | CONSUMABLES</button>
            <button onClick={()=>setcurrentIndex(4)}>LAB RESULTS | SCAN</button>
            <button onClick={()=>setcurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setcurrentIndex(6)}>PRESCRIPTIONS</button> 
        </div>

        <div className='dashboard_body_patient_details_btns'>
            <button className={dispenseIndex === 0 && 'dashboard_body_patient_details_btns_'} onClick={()=>[setdispenseIndex(0), setreload(reload + 1)]}>CONSUMABLES | UTILITIES</button> 
            <button className={dispenseIndex === 1 && 'dashboard_body_patient_details_btns_'} style={{width:'fit-content'}} onClick={()=>[setdispenseIndex(1)]}>ADD CONSUMABLES | UTILITIES</button> 
        </div>

        {
            dispenseIndex === 0 &&
            <div className='dashboard_body cart_container_body'>
                <table className="custome_table">
                    <thead>
                        <tr>
                            <th>DATE</th>
                            <th>CONSUMABLES | UTILITIES </th>
                            <th>QUANTITY</th>
                            <th>PRICE</th>
                            <th>SIGN</th>
                        </tr>
                    </thead>
                    <tbody >
                        {   getitems?.length > 0 &&
                            getitems?.map((item, i)=>{
                            
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

                                const arr = JSON.parse(item?.services) || []

                                const getstaffs = getStaff?.find((res)=> res._id === item?.nurseID)

                                  return (
                                    arr?.items?.length > 0 && 
                                    arr?.items?.map((res, idx) => (
                                        <tr key={`${i}-${idx}`}>
                                            {/* {idx === 0 && (
                                                <td style={{height:'auto'}} rowSpan={arr?.items?.length}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }} className='test_nurse'>
                                                        <p style={{ width: '100px' }}>{day} | {month} | {year}</p>
                                                        <p style={{ width: '100px' }}>{timeString}</p>
                                                    </div>
                                                </td>
                                            )} */}
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <p style={{ width: '100px' }}>{day} | {month} | {year}</p>
                                                    <p style={{ width: '100px' }}>{timeString}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <strong>{res?.name || '-'}</strong>
                                            </td>
                                            <td>
                                                <strong>{res?.quantity || '-'}</strong>
                                            </td>
                                            <td>
                                                <strong>{res?.price || '-'}</strong>
                                            </td>
                                            <td>
                                                <strong>{getstaffs?.name}</strong>
                                            </td>
                                        </tr>
                                    ))
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        }
        
        {
            dispenseIndex === 1 &&
            <div className='dashboard_body cart_container_body'>
                <div className='cart_container' style={{margin:'10px'}} >
                    <h2>SEARCH & DISPENCE UTILITIES</h2>

                    <div className='dashboard_body_header' >
                        <div className='dashboard_body_header_search'>
                            <FaSearch/>
                            <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                        </div>
                    </div>
                    <h3>UTILS DISPLAY</h3>
                    <div className='drug_top_label' style={{width:'100%'}} >
                        <h4 style={{width:'25%', textAlign:'center'}} >UTILITY NAME</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >SELLING PRICE</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >AMOUNT LEFT</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >QUANTITY</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >ACTION</h4>
                    </div>

                    
                    {
                        search?.length > 0 ?
                            search?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <UtilsCard key={i} item={item}/>
                            ))
                        : 
                        utils?.length > 0 ?
                            utils?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <UtilsCard key={i} item={item}/>
                            ))
                        : null
                    }
                </div>

                <div className='cart_checkout' style={{height:'fit-content'}}>
                    <div className='sidebar_spacer' ></div>              
                <h3>CHECK OUT</h3>

                {
                    cartItems?.length > 0 ?
                        cartItems?.map((item, i)=>(
                            <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                <h4>{item?.name}</h4>
                                <h4>{item.quantity}</h4>
                            </div>
                        ))
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
                

                {
                    cartItems?.length > 0  ?
                        <button className='custome_table_btn2' onClick={handleSubmit}>REQUEST UTILITIES</button>
                    :
                    <button style={{opacity:.3}} className='custome_table_btn2'>REQUEST UTILITIES</button>
                }
                </div>
            </div>
        }
    </div>
  )
}

export default DispanseUtils