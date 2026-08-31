import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectid } from '../../features/idSlice';
import { FaChevronLeft, FaSearch } from 'react-icons/fa'
import { selectip } from '../../features/ipSlice'
import { emptyCart, selectCartactualPrice, selectCartTotalPrice } from '../../features/cartSlice';
import DrugsBar from './DrugsBar';
import PreviousePrescribed from './PreviousePrescribed';

function Prescriptions({handleBack, setCurrentIndex, currenIndex, admin}) {

    //axios.defaults.withCredentials = true
    const ip = useSelector(selectip)
    const id = useSelector(selectid);
    const uid = id?.id;
    
    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')
    const [reload, setreload] = useState(0)
    // const [instruction, setinstruction] = useState('')

    const handleSearch = async(e) => {
        e.preventDefault()
        const searchQuery = e.target.value;
        setgetsearch(searchQuery)
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${'localhost'}:7700/docSearch`, value);
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
    const [patient, setpatient] = useState({})

    useEffect(()=>{
        const func =async()=>{
            try {
                await axios.post(`http://${'localhost'}:7700/getprescription`, {uid}).then((res)=>{    
                    console.log(res)            
                    if(res.data.status === 'success'){
                        setutils(res.data.utils)
                        setpatient(res.data.getPatient)
                        setreload(0)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
    },[ip, uid, reload])
      
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
    

    const [instruction, setinstruction] = useState('')

    const handleSubmit=async()=>{
        const getservices = {
            totalPrice: totalPrice,
            actualPrice: actualPrice, 
            profit: profit,
            items: cartItems
        }
        const value ={
            uid ,
            docID: getid?._id,
            services: JSON.stringify(getservices),
            cartItems,
            instruction
        }

        try {
            await axios.post(`http://${'localhost'}:7700/docBill`, value).then((res)=>{                
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    localStorage.removeItem('cart')
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const dispatch = useDispatch()

    const handleSubmit1=async()=>{
        const items = cartItems?.map((res)=> ({
                drugs : res.name,
                price : res.price,
                actualPrice : res.actualPrice,
                profit : res.totalPrice - res.actualPrice,
                days : res.days,
                time : res.time,
                dosage : res.dosage,
                id: res.id,
                quantity: res.quantity,
                timeStamp: new Date().getTime(),
                status: 'continue'
            })
        )

        const inst ={
            instruction,
            timeStamp: new Date().getTime()
        }

        const value ={
            uid ,
            instruction: inst,
            doctorID: getid?._id,
            items,
        }

        try {
            await axios.post(`http://${'localhost'}:7700/PrescribeInPatient`, value).then((res)=>{     
                console.log(res);
                           
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    localStorage.removeItem('cart')
                    setinstruction('')
                    dispatch(emptyCart())
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const [innerIndex, setInnerIndex] = useState(0)


  return (
    <div className='dashboard_body' >
        <div className='back_btn_' onClick={handleBack}>
            <FaChevronLeft /> 
            <h4>BACK</h4>
        </div>
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setCurrentIndex(0)}>PATIENT DETAILS</button>
            <button onClick={()=>setCurrentIndex(1)}>VITALS</button>
            <button onClick={()=>setCurrentIndex(2)}>LAB RESULTS | SCAN</button>
            {/* <button onClick={()=>setCurrentIndex(3)}>PREVIOUS VISITS</button> */}
            <button className={currenIndex === 3 && 'dashboard_body_patient_details_btns_'} >PRESCRIPTION</button>
            <button onClick={()=>setCurrentIndex(5)}>MEDICATION CHART</button>
            <button onClick={()=>setCurrentIndex(4)}>TRANSACTION HISTORY</button>
        </div>

        <div className='dashboard_body_patient_details_btns'>
            <button className={innerIndex === 0 && 'dashboard_body_patient_details_btns_'} onClick={()=>setInnerIndex(0)}>NEW PRESCRIPTION</button>
            <button className={innerIndex === 1 && 'dashboard_body_patient_details_btns_'} onClick={()=>setInnerIndex(1)} >PREVIOUS PRESCRIPTION</button>
        </div>
        
        {
            innerIndex === 0 &&
            <div className='dashboard_body cart_container_body' style={{overflow:'hidden', width:'100%', padding:0}}>
                <div className='cart_container' style={{margin:'10px', overflow:'auto'}} >
                    <h2>SEARCH & DISPENCE DRUGS</h2>

                    <div className='dashboard_body_header' >
                        <div className='dashboard_body_header_search'>
                            <FaSearch/>
                            <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                        </div>
                    </div>
                    <h3>UTILS DISPLAY</h3>
                    <div className='drug_top_label' style={{width:'100%'}} >
                        <h4 style={{width:'25%', textAlign:'center'}} >EXPIRING</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >DRUG</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >TIME</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >DAYS</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >AMOUNT LEFT</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >DOSAGE</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >QUANTITY</h4>
                        <h4 style={{width:'25%', textAlign:'center'}} >ACTION</h4>
                    </div>

                    
                    {
                        search?.length > 0 ?
                            search?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <DrugsBar admin={admin} key={i} item={item}/>
                            ))
                        : 
                        utils?.length > 0 ?
                            utils?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                <DrugsBar admin={admin} key={i} item={item}/>
                            ))
                        : null
                    }
                </div>

                {
                    !admin &&
                    <div className='cart_checkout' style={{height:'fit-content'}}>
                        
                        <div className='previouse_medicals_textareas_NOTE' >
                            <div >
                                <h4>ENTER INSTRUCTION</h4>
                                <textarea placeholder='Enter Instruction' style={{height:'300px'}}  value={instruction} onChange={(e)=>setinstruction(e.target.value)} />
                            </div>
                        </div>
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
                            <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                            <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                        </div>

                        {
                        cartItems?.length > 0  ?
                            patient?.status === 'admitted' ?
                            <button className='custome_table_btn2' onClick={handleSubmit1}>SEND PRESCRIPTION</button>
                            :
                            <button className='custome_table_btn2' onClick={handleSubmit}>SEND PRESCRIPTION</button>
                        :
                        <button style={{opacity:.3}} className='custome_table_btn2'>SEND PRESCRIPTION</button>
                        }
                    </div>
                }
            </div>
        }

        {
            innerIndex === 1 &&
            <PreviousePrescribed/>
        }
    </div>
  )
}

export default Prescriptions