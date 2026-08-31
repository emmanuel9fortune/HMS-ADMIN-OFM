import React from 'react'
import EditPopReceipt from './EditPopReceipt'
import EditTestReceipt from './EditTestReceipt';

function EditPop({service, getid, setgetid, handleBills, uid}) {
    
   const items = service?.items

  //  console.log(service);
    
  return (
    <div style={{width:'700px', height:'800px', display:'flex', flexDirection:'column', alignItems:'center', backgroundColor:'cadetblue', padding:'20px 0', overflowY:'scroll', position:'relative'}}>
        {
            items?.length > 0 ?
            items?.map((item, i)=>(
                <EditPopReceipt item={item} key={i} items={items} data={items} getid={getid} setgetid={setgetid} handleBills={handleBills} uid={uid} />
            ))
            :
            service?.length > 0 ?
              service?.map((item, i)=>(
                <EditTestReceipt item={item} key={i} items={items} data={service} getid={getid} setgetid={setgetid} handleBills={handleBills} uid={uid} />
              ))
            : null
        }
        <button onClick={()=>setgetid('')} style={{margin: '50px 0', width:'90%', backgroundColor:'whitesmoke', color:'red'}} className='custome_table_btn2' >CLOSE EDIT</button>
    </div>
  )
}
 
export default EditPop