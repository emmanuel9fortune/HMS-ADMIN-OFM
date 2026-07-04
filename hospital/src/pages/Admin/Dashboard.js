import React, { useState } from 'react'
import AdminBar from '../../components/AdminBar'
import { MdNotificationImportant } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'
import { selectip } from '../../features/ipSlice'
import axios from 'axios'
import { FiLoader, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Alert from './Alert'

function Dashboard() {

    const info = useSelector(selectinfo)
    const ip = useSelector(selectip)
    
    const Formatted1 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.invoice);
    
    const Formatted2 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.numberOfutils);
    
    const Formatted3 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.numberOfPatients);
    
    const Formatted4 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0
    }).format(info?.staffs?.length);

    // ================================================== //
    // |||||||||||||||||||||||||||||||||||||||||||||||||| //
    // ================================================== //

    const formatted = info?.batches?.map(batch=>({
        label: batch
    }))

    const [getbatch, setgetbatch] = useState(null)
    const [getbatches, setgetbatches] = useState([])
  const cip = window.location.hostname

    const handleBatch =async(e)=>{
        const batch = e.target.value
        if(!batch){
            return setgetbatch(null)
        }
        setgetbatches(batch)
        try{
            await axios.post(`http://${cip || 'localhost'}:7700/batchanalist`, {batch}).then((res)=>{
                if(res.data.status === 'success'){
                    setgetbatch(res.data.analytics[0])
                }
            })
        }catch(error){
            console.log(error)
        }
    }
    
    const Formatted5 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format( info?.analytics?.totalOriginalQuantity);
    
    const Formatted15 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getbatch?.totalOriginalQuantity);

    const Formatted6 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.analytics?.totalQuantity);

    const Formatted16 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getbatch?.totalQuantity);

    const getSold = info?.analytics?.totalOriginalQuantity - info?.analytics?.totalQuantity
    const getSold1 = getbatch?.totalOriginalQuantity - getbatch?.totalQuantity 
    
    const Formatted7 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getSold);
    
    const Formatted17 = new Intl.NumberFormat('en-NG', {
        // style: 'currency',
        // currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getSold1);
    
    const Formatted8 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.analytics?.totalAmount);
    
    const Formatted18 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getbatch?.totalAmount);
    
    const Formatted9 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.analytics?.totalActualAmount);
    
    const Formatted19 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(getbatch?.totalActualAmount);
    
    const Formatted10 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(info?.analytics?.totalAmount - info?.analytics?.totalActualAmount);
    
    const Formatted110 = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format( getbatch?.totalAmount - getbatch?.totalActualAmount);

    const [count, setcount] = useState(0)
    const [batch, setbatch] = useState('')


  return (
    <div className='dashboard_container'>
        <AdminBar/> 

        <div className='dashboard_body' >
            <h1>Dashboard</h1>
            <div style={{width:'100%', display:'flex', alignItems:'center'}}>
                <div className='dashboard_body_header_displays' style={{cursor:'pointer'}} onClick={()=>window.location.reload()} >
                    <div className='dashboard_body_header_displays_icon'>
                        <FiLoader size={25} color="#0463ca" />
                    </div>
                    
                    <div className='dashboard_body_header_displays_text'>
                        <h1>Reload</h1>
                    </div>
                </div>

                <div className='dashboard_body_header_displays' style={{cursor:'pointer'}} onClick={()=>window.location.reload()} >
                    <div className='dashboard_body_header_displays_icon'>
                        <FiTrendingUp size={25} color="#0463ca" />
                    </div>

                    <Link to='/data_analyst' className='dashboard_body_header_displays_text'>
                        <h1>Data Analysis</h1>
                    </Link>
                </div>
            </div>

            <div className='admin_dashboard_boxes' >
                <div className='admin_dashboard_box' >
                    <h4>Total Invoice</h4>
                    <h2>{Formatted1}</h2>
                    <p>Total number of completed transaction</p>
                </div>
                
                <div className='admin_dashboard_box' >
                    <h4>Stocks Available</h4>
                    <h2>{Formatted2}</h2>
                    <p>Total number of stocks (utilities) available</p>
                </div>

                <div className='admin_dashboard_box' >
                    <h4>Total Patient</h4>
                    <h2>{Formatted3}</h2>
                    <p>Total number of patients</p>
                </div>

                <div className='admin_dashboard_box' >
                    <h4>Total Staff</h4>
                    <h2>{Formatted4}</h2>
                    <p>Total number of Staffs </p>
                </div>

            </div>

            <div className='admin_dashboard_body' >
                <div className='admin_dashboard_body_box' >
                    <div className="calcl_bar" >
                        <h3 style={{margin:'0'}} >STOCK ANALYTICS</h3>
                        <select value={getbatches} onChange={handleBatch}>
                            <option value=''>Select Batch</option>
                            {   formatted &&
                                formatted?.map((item, i)=>(
                                    <option key={i} value={item?.label} >{item?.label}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Original Quantity Of Utilities</h4>
                        <h2>{getbatch !== null ? Formatted15 : Formatted5}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Utilities Left</h4>
                        <h2>{getbatch !== null ? Formatted16 : Formatted6}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Utilities Sold</h4>
                        <h2>{getbatch !== null ? Formatted17 : Formatted7}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Amount Made</h4>
                        <h2>{getbatch !== null ? Formatted18 : Formatted8}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Orignal Amount</h4>
                        <h2>{getbatch !== null ? Formatted19 : Formatted9}</h2>
                    </div>
                    <div className="calcl_bar" >
                        <h4>Profit</h4>
                        <h2>{getbatch !== null ? Formatted110 : Formatted10}</h2>
                    </div>
                </div>
                <div className='admin_dashboard_body_box' >
                    <h3>STAFFS ON DUTY</h3>

                    {
                        info?.staffs?.length > 0 ?
                            info?.staffs?.map((item, i)=>(
                                <div key={i} className='recentpatientdashcard' >
                                    <div className='recentpatientdashcard_desc'>
                                        <h4>{item?.name}</h4>
                                        <p>{item?.title}</p>
                                    </div>

                                    <div className='Patientqueuecard_button'>
                                        <p>{item?.status}</p>
                                    </div>
                                </div>
                            ))
                        : null
                    }
                </div>
                <div className='admin_dashboard_body_box' >
                    <h3>STOCK ALERT</h3>    

                                         
                        <div className='task_bar' style={{width:'100%', display:'flex', alignItems:'center', flexDirection:'column'}}> 
                            
                            <div style={{width:'100%', display:'flex', alignItems:'center'}} >
                                <div style={{width:'fit-content', borderRadius:'999px', border:'1px solid grey', padding:'5px'}} >
                                    <button style={count !== 0 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent', transition:'.2s'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(0)}>DRUGS EXPIRING</button>
                                    <button style={count !== 1 ? {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'transparent'} : {padding:'15px 10px', borderRadius:'999px', border:'none', backgroundColor:'blue', color:'white', transition:'.2s'}} onClick={()=>setcount(1)}>OUT OF STOCK</button>
                                </div>
                                    
                                <div style={{margin:'0 20px'}}>
                                    <select value={batch} onChange={(e)=> setbatch(e.target.value)} style={{padding:'10px'}} >
                                        <option value=''>ALL BATCHES</option>
                                        {   info?.batches &&
                                            info?.batches?.map((item, i)=>(
                                                <option key={i} value={item} >{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {
                                info?.stocksExpire?.length > 0 || info?.utilsQty?.length > 0 ?
                                    count === 0 ? 
                                        Object.values(info?.stocksExpire)?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                            batch !== '' ?
                                            item?.batch === batch  ?
                                                <Alert key={i} item={item} count={count} batch={batch} />
                                            : null
                                            :<Alert key={i} item={item} count={count} batch={batch} />
                                        ))
                                    :
                                        Object.values(info?.utilsQty)?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                                            batch !== '' ?
                                            item?.batch === batch  ?
                                                <Alert key={i} item={item} count={count} batch={batch} />
                                            : null
                                            :<Alert key={i} item={item} count={count} batch={batch} />
                                        ))
                                : null
                            }
                        </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard