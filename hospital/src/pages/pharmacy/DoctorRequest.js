import React, { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectid } from '../../features/idSlice'
import axios from 'axios'
import { selectip } from '../../features/ipSlice'
import { toast } from 'react-toastify'

function DoctorRequest({handleBack, setcurrentIndex, currentIndex}) {
    const ip = useSelector(selectip)

    const id = useSelector(selectid)
    const uid = id?.id;
    const [reload, setreload] = useState(0)

    const [checkOut, setcheckOut] = useState([])
    const [staff, setstaff] = useState([])

    useEffect(()=>{
        const func =async()=>{
            try {
                await axios.post(`http://${'localhost'}:7700/drugRequest`, {uid}).then((res)=>{
                    //console.log(res);
                    
                    if(res.data.status === 'success'){
                        setcheckOut(res.data.utils)
                        setstaff(res.data.getStaffDetails)
                        setreload(0)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
    },[uid, ip, reload])

    
    const handleCheckOut =async(uid, billId)=>{
        try {
        await axios.post(`http://${'localhost'}:7700/utilsDispenser`, {
            uid,
            billId,
        }).then((res)=>{ 
            if(res.data.status === 'success'){
            setreload(reload + 1)
            toast.success('PATIENT CHECKOUT SUCCESSFUL')
            }
        })
        } catch (error) {
        console.log(error);
        }
    }

  return (
    <div className='dashboard_body' >
        <div className='back_btn_' onClick={handleBack}>
            <FaChevronLeft />
            <h4>BACK</h4>
        </div>
        
        <div className='dashboard_body_patient_details_btns'>
            <button onClick={()=>setcurrentIndex(1)}>UTILITY REQUESTS</button>
            <button className={currentIndex === 2 && 'dashboard_body_patient_details_btns_'} >DRUG REQUESTS</button>
        </div>
        
         
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

                    const getstaff = staff?.length > 0 ? staff?.find((stf)=> stf?._id === item?.doctorID) : []

                    return(
                    <div key={i}>
                        <h4 style={{margin:'10px 0'}} >DOCTOR {getstaff?.name} PRESCRIPTION</h4>
                        <p style={{margin:'10px 0'}}>{item?.instruction}</p>
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
                        
                            <div className='cart_checkout_price' >
                                <h3 style={{margin:'7px 0'}}>ACTUAL PRICE</h3>
                                <h3 style={{margin:'7px 0'}}>{getBill?.actualPrice ? formatted2 : ''}</h3>
                            </div>
                                
                            <div className='cart_checkout_price' >
                                <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                                <h3 style={{margin:'7px 0'}}>{formatted}</h3>
                            </div>
                                
                            <div className='cart_checkout_price' >
                                <h3 style={{margin:'7px 0'}}>PROFIT</h3>
                                <h3 style={{margin:'7px 0'}}>{getBill?.actualPrice ? formatted3 : ''}</h3>
                            </div>
                            

                            {
                                getBill ?
                                <button onClick={()=>handleCheckOut(item?.uid, item?._id)} style={{margin: '20px 0', width:'100%'}} className='custome_table_btn2' >CHECK OUT NOW</button>
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
    </div>
  )
}

export default DoctorRequest