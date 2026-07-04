import React, { useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'

function DrugsBar({item, reload, setreload, getsearch, handleSearch, setGetItems, setdelet}) {    
    
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })

    const date = new Date(Number(item?.expireDate * 1000))
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()



    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1

    const expires = item?.expireDate * 1000
    const today = expires >= start && expires <= end || expires < start
    const cip = window.location.hostname
    

    const handleInc =async()=>{
        try {
            await axios.post(`http://${cip || 'localhost'}:7700/incDec`, {dec: false, id: item?._id}).then((res)=>{
                if(res.data.status === 'success'){
                setreload(reload + 1)
                handleSearch(getsearch)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleDec =async()=>{
        try {
            await axios.post(`http://${cip || 'localhost'}:7700/incDec`, {dec: true, id: item?._id}).then((res)=>{
                if(res.data.status === 'success'){
                setreload(reload + 1)
                handleSearch(getsearch)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleAdd =async()=>{
       
        const value ={
        name: item?.name + " " +'(STAFF)',
        quantity: item?.quantity,
        expireDate: item?.expireDate,
        originalPrice: item?.originalPrice,
        sellingPrice: item?.sellingPrice,
        batch: item?.batch,
        limit: item?.limit,
        explimit: item?.explimit,
        type: item?.type,
        date: new Date().getTime(),
        class: item?.class
        }

        try {
        await axios.post(`http://${cip || 'localhost'}:7700/addStaffUils`, value).then((res)=>{
            console.log(res);
            
            if(res.data.status === 'success'){
            toast.success('UTILITY ADDED SUCCESSFULLY')
            setreload(reload + 1)
            }
        })
        } catch (error) {
        console.log(error);
        }
    }


  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <h4>{`${day}-${month}-${year}`}</h4>
            {
              today ?
              <p style={{color:'red'}} >Expired</p>
              :
              <p>Day-Month-Year</p>
            }
        </div>

        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <p>{item?.name}</p>
        </div>

        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <p>{formatted.format(item?.originalPrice)}</p>
        </div>

        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <p>{formatted.format(item?.sellingPrice)}</p>
        </div>

        <div className='Patientqueuecard_button' style={{width:'25%', justifyContent:'center'}}>
            <button onClick={handleDec} className='searchresultcard_view1' >
              <FaMinus/>
            </button>
                <h4>{item?.quantity}</h4>
            <button onClick={handleInc} className='searchresultcard_view2'>
              <FaPlus/>
            </button>
        </div>

        <button style={{width:'25%', backgroundColor:'red'}} onClick={()=> setdelet(item)} className='ADD_Cart_btn'>DELETE ITEM</button>

        <button style={{width:'22%', backgroundColor:'orange'}} onClick={()=> setGetItems(item)} className='ADD_Cart_btn'>EDIT ITEM</button>

        <button style={{width:'22%', backgroundColor:'green'}} onClick={handleAdd} className='ADD_Cart_btn'>ADD</button>
      
    </div>
  )
}

export default DrugsBar