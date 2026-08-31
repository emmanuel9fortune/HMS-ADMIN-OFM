import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectip } from '../../features/ipSlice';
import { selectid } from '../../features/idSlice';
import { toast } from 'react-toastify';

function PreviousePrescribed() {
    const ip = useSelector(selectip)
    const id = useSelector(selectid);
    const uid = id?.id;

    const [utils, setutils] = useState([])
    const [getIn, setgetIn] = useState([])
    const [staffs, setstaffs] = useState([])
    const [reload, setreload] = useState(0)

    useEffect(()=>{
        const func =async()=>{
            try {
                await axios.post(`http://${'localhost'}:7700/getPrevPrescrition`, {uid}).then((res)=>{     
                    console.log(res);
                               
                    if(res.data.status === 'success'){
                        setutils(res.data.utils)
                        setgetIn(res.data.prescribe)
                        setstaffs(res.data.getStaffDetails)
                        setreload(0)
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        func()
    },[ip, uid, reload])

    const combined = [...new Set([...utils, ...getIn])]

    const handleDiscontinue =async(mainId, id)=>{
        try {
            await axios.post(`http://${'localhost'}:7700/discontinue`, {uid, mainId, id}).then((res)=>{     
                console.log(res);
                            
                if(res.data.status === 'success'){
                    toast.success('PRESCRIPTION DISCONTINUED')
                    setreload(reload + 1)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div className='patient_details_input_field1' style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
        {
            combined?.sort((a, b)=> b.timeStamp - a.timeStamp).map((item, i)=>{

                const date = new Date(Number(item?.timeStamp))
                const day = date.getDate()
                const month = date.getMonth() 
                const year = date.getFullYear()
                let hours = date.getHours()
                const minutes = date.getMinutes()
                const ampm = hours >= 12 ? "PM" : "AM"
            
                hours = hours % 12
                hours = hours ? hours : 12
            
                const pad = (n) => n.toString().padStart(2, '0')
            
                const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`
                if(item?.services){
                    const utils = JSON.parse(item?.services)
                    const staff = staffs?.length > 0 ? staffs?.find((sff)=> sff?._id === item?.doctorID) : []

                    return(
                        <div style={{width:'100%', display:'flex', justifyContent:'center', flexDirection:'column', alignItems:'center'}}>
                            {
                                !item?.id &&
                                <div key={i} className='prescribe_container' style={{borderBottom:'.4px solid #c3c3c3', width:'80%'}} >
                                    <h3 style={{margin:'20px 0', color:'#fff'}} >PRESCRIPTIONS - |   By Doctor {staff?.name} |   {`${day}-${month}-${year}`}, {timeString} </h3>
                                    <div className='drug_top_label' style={{width:'100%', margin:'20px 0'}} >
                                        <h4 style={{width:'20%', textAlign:'center'}} >NAME</h4>
                                        <h4 style={{width:'20%', textAlign:'center'}} >QUANTITY</h4>
                                        <h4 style={{width:'20%', textAlign:'center'}} >DAYS</h4>
                                        <h4 style={{width:'20%', textAlign:'center'}} >DOSAGE</h4>
                                        <h4 style={{width:'20%', textAlign:'center'}} >TIME</h4>
                                    </div>
                                    {
                                        utils?.items?.length > 0 ?
                                            utils?.items?.map((item, i)=>(
                                                <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                                    <h4 style={{textAlign:'center', width:'20%', margin:'10px 0'}}>{item?.name}</h4>
                                                    <h4 style={{textAlign:'center', width:'20%', margin:'10px 0'}}>{item?.quantity}</h4>
                                                    <h4 style={{textAlign:'center', width:'20%', margin:'10px 0'}}>{item?.days}</h4>
                                                    <h4 style={{textAlign:'center', width:'20%', margin:'10px 0'}}>{item?.dosage}</h4>
                                                    <h4 style={{textAlign:'center', width:'20%', margin:'10px 0'}}>{item?.time}</h4>
                                                </div>
                                            ))
                                        : null
                                    }
                                    <h4 style={{margin:'10px 0', color:'#fff'}} >INSTRUCTIONS : {item?.instruction} </h4>
                                    
                                </div>
                            }
                        </div>
                    )
                }else{
                    const staff = staffs?.length > 0 ? staffs?.find((sff)=> sff?._id === item?.doctorID) : []
                return(
                    <div key={i} className='prescribe_container' style={{borderBottom:'.4px solid #c3c3c3', width:'80%'}} >
                        <h3 style={{margin:'20px 0', color:'#fff'}} >IN-PATIENT PRESCRIPTIONS - | By Doctor {staff?.name} | {`${day}-${month}-${year}`}, {timeString} </h3>
                        <div className='drug_top_label' style={{width:'100%', margin:'20px 0'}} >
                            <h4 style={{width:'20%', textAlign:'center'}} >NAME</h4>
                            <h4 style={{width:'20%', textAlign:'center'}} >QUANTITY</h4>
                            <h4 style={{width:'20%', textAlign:'center'}} >DAYS</h4>
                            <h4 style={{width:'20%', textAlign:'center'}} >TIME</h4>
                            <h4 style={{width:'20%', textAlign:'center'}} >DOSAGE</h4>
                            <h4 style={{width:'20%', textAlign:'center'}} >ACTION</h4>
                        </div>

                        {
                            item?.prescribe?.length > 0 ?
                                item?.prescribe?.sort((a, b)=> b?.timeStamp - a?.timeStamp).map((items, i)=>(
                                    <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                                        <h4 style={items?.status === 'discontinue' ? {textDecoration: 'line-through', color:'red', textAlign:'center', width:'20%'} :{textAlign:'center', width:'20%'}} >{items?.drugs}</h4>
                                        <h4 style={items?.status === 'discontinue' ? {textDecoration: 'line-through', color:'red', textAlign:'center', width:'20%'} :{textAlign:'center', width:'20%'}} >{items?.quantity}</h4>
                                        <h4 style={items?.status === 'discontinue' ? {textDecoration: 'line-through', color:'red', textAlign:'center', width:'20%'} :{textAlign:'center', width:'20%'}} >{items?.days}</h4>
                                        <h4 style={items?.status === 'discontinue' ? {textDecoration: 'line-through', color:'red', textAlign:'center', width:'20%'} :{textAlign:'center', width:'20%'}} >{items?.time}</h4>
                                        <h4 style={items?.status === 'discontinue' ? {textDecoration: 'line-through', color:'red', textAlign:'center', width:'20%'} :{textAlign:'center', width:'20%', margin:'10px 0'}} >{items?.dosage}</h4>

                                        {
                                            items?.status === 'continue' ?
                                            <button style={{padding:'10px', width:'20%'}} onClick={()=>handleDiscontinue(item?._id, items?._id)} >DISCONTINUE</button>
                                            :
                                            <button style={{padding:'10px', width:'20%', color:'red', textDecoration: 'line-through'}} disabled >DISCONTINUED</button>

                                        }
                                    </div>
                                ))
                            : null
                        }
                        <h4 style={{margin:'10px 0', color:'#fff'}} >INSTRUCTIONS : </h4>
                        {
                            item?.instruction?.sort((a, b)=> b?.timeStamp - a?.timeStamp).map((res, i)=>{
                                
                            const date = new Date(Number(res?.timeStamp))
                            const day = date.getDate()
                            const month = date.getMonth() 
                            const year = date.getFullYear()
                            let hours = date.getHours()
                            const minutes = date.getMinutes()
                            const ampm = hours >= 12 ? "PM" : "AM"
                        
                            hours = hours % 12
                            hours = hours ? hours : 12
                        
                            const pad = (n) => n.toString().padStart(2, '0')
                        
                            const timeString = `${pad(hours)}:${pad(minutes)} ${ampm}`

                            return (
                                <div key={i} style={{borderBottom:'1px solid grey', margin:'10px 0', padding:'5px', backgroundColor:'#c3c3c346'}} >
                                    <p>{`${day}-${month}-${year}`}, {timeString}</p>
                                    <h4>{res?.instruction}</h4>
                                </div>
                            )})
                        }
                        
                    </div>
                )
                }
            })
        }
        
    </div>
  )
}

export default PreviousePrescribed