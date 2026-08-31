import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'

function EditTestReceipt({item, data, getid, setgetid, handleBills, uid}) {
    const cip = window.location.hostname
    
    const updatedItem = [...data]
    const [ret, setret] = useState(false)

    const handleReturn =async()=>{
        try {
            const update = updatedItem?.filter((itms)=> itms?.testname !== item?.testname )
                  
            await axios.post(`http://${cip || 'localhost' }:7700/UpdateReceipt`, {services: JSON.stringify(update), id: getid}).then(async(res)=>{
                // console.log(res);
                
                if(res.data.status === 'success'){
                    toast.success('UPDATE SAVED')
                    setgetid('')
                    handleBills(uid)
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
                        <h1>Want to Delete {item?.testname} ?</h1>
                    </div>
                    
                    <button className='add_staff_contaimer_button' onClick={handleReturn} style={{color:'white', background:'red'}}>CONFIRM</button>
                    <button className='add_staff_contaimer_button' onClick={()=>setret(false)} style={{color:'blue', background:'Whitesmoke'}}>CANCEL RETURN</button>
                </div>
            : null
        }
        <div style={{width:'90%'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}} >
                <div>
                    <p>TEST TYPE : {item?.testname}</p>
                </div>
                <div>
                    <p>Total Price : {item?.price} </p>
                    <div>
                        <button onClick={()=>setret(true)} style={{margin:'0 10px', padding:'10px', color:'white', backgroundColor:'red'}}>DELETE</button> 
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default EditTestReceipt