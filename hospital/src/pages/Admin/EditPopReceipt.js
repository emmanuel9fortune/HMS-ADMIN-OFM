import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'

function EditPopReceipt({item, data, getid, setgetid, handleBills, uid}) {
    const cip = window.location.hostname
    const [qty, setqty] = useState(0)

    const handleQty =async(e)=>{
        const quantity = e.target.value
        setqty(quantity)
    }    
    
    const cqty = Number(item?.quantity) - Number(qty)
    const updatedItem = [...data]

    const handleSave =async()=>{
        try {
            await axios.post(`http://${cip || 'localhost' }:7700/EditUtils`, {name: item?.name || item?.drugs, quantity: cqty}).then(async(res)=>{
                if(res.data.status === 'success'){
                    const update = updatedItem?.map((itms)=> itms?.name ? itms?.name === item?.name ? {...itms, quantity: Number(qty), totalPrice: Number(qty) * Number(item?.price)} : itms : itms?.drugs === item?.drugs ? {...itms, quantity: Number(qty), totalPrice: Number(qty) * Number(item?.price)} : itms)
                    // console.log(update);
                    let totalPrice = 0;
                    
                    update.forEach(item => {
                        totalPrice += item.totalPrice || item.price * item.quantity || 0;
                    });

                    
                    const services = { 
                        items: update,
                        totalPrice
                    }
                    await axios.post(`http://${cip || 'localhost' }:7700/UpdateReceipt`, {services: JSON.stringify(services), id: getid}).then(async(res)=>{
                        // console.log(res);
                        
                        if(res.data.status === 'success'){
                            toast.success('UPDATE SAVED')
                            setqty(0)
                            setgetid('')
                            handleBills(uid)
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
            toast.error('SOMETHING WENT WRONG')
        }
    }

    const [ret, setret] = useState(false)

    const handleReturn =async()=>{
        try {
            await axios.post(`http://${cip || 'localhost' }:7700/EditUtils`, {name: item?.name || item?.drugs, quantity: item?.quantity}).then(async(res)=>{
                if(res.data.status === 'success'){
                    const update = updatedItem?.filter((itms)=> itms?.name ? itms?.name !== item?.name  : itms?.drugs !== item?.drugs)
                    // console.log(update);
                    let totalPrice = 0;
                    
                    update.forEach(item => {
                        totalPrice += item.totalPrice || item.price * item.quantity || 0;
                    });

                    
                    const services = {
                        items: update,
                        totalPrice
                    }
                    await axios.post(`http://${cip || 'localhost' }:7700/UpdateReceipt`, {services: JSON.stringify(services), id: getid}).then(async(res)=>{
                        // console.log(res);
                        
                        if(res.data.status === 'success'){
                            toast.success('UPDATE SAVED')
                            setqty(0)
                            setgetid('')
                            handleBills(uid)
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error);
            
        }
    }

  return (
    <>
        {
            ret ?
            <div style={{ width:'95%', position:'absolute', zIndex:10000, top:'20px', left: '20px'}}>
                <div style={{width:'100%', height:'300px', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding:'20px'}}></div>
                    <div className='patient_details_input_field1_'  >
                        <h1>Want to Delete {item?.name || item?.drugs} ?</h1>
                    </div>
                    
                    <button className='add_staff_contaimer_button' onClick={handleReturn} style={{color:'white', background:'red'}}>CONFIRM</button>
                    <button className='add_staff_contaimer_button' onClick={()=>setret(false)} style={{color:'blue', background:'Whitesmoke'}}>CANCEL RETURN</button>
                </div>
            : null
        }
            <div style={{width:'90%'}}>

                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}} >
                    <div>
                        <p>{item?.name || item?.drugs}</p>
                        <p>Quantity : {  item?.quantity }</p>
                    </div>
                    <div>
                        <p>Total Price : {qty <= 0 ? item?.totalPrice : qty * item?.price} </p>
                        <div>
                            <label>Edit Quantity: </label>
                            <input value={qty} onChange={handleQty} type='number' style={{width:'100px', padding:'0 5px'}}/>
                            <button onClick={()=>setret(true)} style={{margin:'0 10px', padding:'10px', color:'white', backgroundColor:'red'}}>RETURN</button> 
                        </div>
                    </div>
                </div>
                {
                    qty ?
                    <button onClick={()=>handleSave()} style={{margin: '20px 0', width:'90%'}} className='custome_table_btn2' >SAVE ITEM</button>
                    : null
                }

                
                
            </div>
    </>
  )
}

export default EditPopReceipt