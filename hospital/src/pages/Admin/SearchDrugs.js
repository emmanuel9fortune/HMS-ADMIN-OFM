import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios'
import DrugsBar from './DrugBar'
import { toast } from 'react-toastify'

function SearchDrugs() {

    const [search, setsearch] = useState([])
    const [getsearch, setgetsearch] = useState('')
    const cip = window.location.hostname
  
    const handleSearch = async(e) => {
        
        const searchQuery = typeof e === 'string' ? e : e?.target?.value || '';
        setgetsearch(searchQuery);

        if (searchQuery.trim().length === 0) {
            setsearch([]);
            return;
        }
        
        
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${cip || 'localhost'}:7700/searchutils`, value);
                setsearch(response.data.utils)                 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }
  
    const [utils, setutils] = useState([])
    const [reload, setreload] = useState(0)
  
    useEffect(()=>{
      const func =async()=>{
          try {
              await axios.post(`http://${cip || 'localhost'}:7700/getUtils`).then((res)=>{                
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
    },[reload, cip])

    const [getItems, setGetItems] = useState({})
    const [delet, setdelet] = useState({})
    
    const [drugname, setdrugname] = useState()
    const [oprice, setoprice] = useState()
    const [sprice, setsprice] = useState()
    const [expireDate, setexpireDate] = useState()
    const [quantity, setquantity] = useState()
    const [originalQuantity, setoriginalQuantity] = useState()
    const [batch, setbatch] = useState()
    const [explimit, setexplimit] = useState()
    const [limit, setlimit] = useState()

    useEffect(()=>{
        setdrugname(getItems?.name)
        setoprice(getItems?.originalPrice)
        setsprice(getItems?.sellingPrice)
        setexpireDate(getItems?.expireDate)
        setquantity(getItems?.quantity)
        setoriginalQuantity(getItems?.originalQuantity)
        setbatch(getItems?.batch)
        setexplimit(getItems?.explimit)
        setlimit(getItems?.limit)
    },[getItems])
            
    
    const handleDrugName =async(e)=>{
        setdrugname(e.target.value)        
        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: e.target.value, oprice, sprice, originalQuantity, quantity, expireDate, batch, limit, explimit, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleOprice =async(e)=>{
        setoprice(e.target.value)

        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: drugname, oprice: e.target.value, sprice, originalQuantity, quantity, expireDate, batch, limit, explimit, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleSprice =async(e)=>{
        setsprice(e.target.value)

        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: drugname, oprice, sprice: e.target.value, originalQuantity, quantity, expireDate, batch, limit, explimit, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleOrgQuantity =async(e)=>{
        setoriginalQuantity(e.target.value)

        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: drugname, oprice, sprice, originalQuantity: e.target.value, quantity, expireDate, batch, limit, explimit, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleQuantity =async(e)=>{
        setquantity(e.target.value)

        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: drugname, oprice, sprice, originalQuantity, quantity: e.target.value, expireDate, batch, limit, explimit, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleExpDate =async(e)=>{
        setexpireDate(e.target.value)

        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: drugname, oprice, sprice, originalQuantity, quantity, expireDate: e.target.value, batch, limit, explimit, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleBatch =async(e)=>{
        setbatch(e.target.value)

        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: drugname, oprice, sprice, originalQuantity, quantity, expireDate, batch: e.target.value , limit, explimit, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleOsLimit =async(e)=>{
        setlimit(e.target.value)

        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: drugname, oprice, sprice, originalQuantity, quantity, expireDate, batch, limit: e.target.value, explimit, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleExpLimit =async(e)=>{
        setexplimit(e.target.value)

        try {
            await axios.post(`http://${cip || 'localhost'}:7700/editdrug`, {name: drugname, oprice, sprice, originalQuantity, quantity, expireDate, batch, limit, explimit: e.target.value, id: getItems?._id}).then((res)=>{
                setreload(reload + 1)
            })
        } catch (error) {
            console.log(error);
        }
    }

    
    const handleDelete =async()=>{
        try {
            await axios.post(`http://${cip || 'localhost'}:7700/deleteUtils`, {utilID: delet?._id}).then((res)=>{
                if(res.data.status === 'success'){
                setreload(reload + 1)
                handleSearch(getsearch)
                setdelet('')
                toast.success('ITEM DELETED SUCCESSFULLY')
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const data = (date) =>{
        const d = new Date(date * 1000)
        const year = d.getFullYear() 
        const month = String(d.getMonth() + 1).padStart(2, "0") 
        const day = String(d.getDate()).padStart(1, "0")
        const formatted = `${year}-${month}-${day}`
        return formatted
    }

  return (
    <div className='dashboard_container'>
      <AdminBar/> 
        <div className='dashboard_body' >
          <div className='dashboard_body_header' >
              <div className='dashboard_body_header_search'>
                  <FaSearch/>
                  <input value={getsearch} onChange={handleSearch} placeholder='Search' />
              </div>
               
          </div>

            <h3>SEARCH RESULTS</h3> 
            <div className='drug_top_label' style={{width:'100%'}} >
                <h4 style={{width:'25%', textAlign:'center'}} >EXPIRES ON</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >UTILITY NAME</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >ORIGINAL PRICE</h4> 
                <h4 style={{width:'25%', textAlign:'center'}} >SELLING PRICE</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >AMOUNT LEFT</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >ACTION</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >EDIT</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >ADD STAFF</h4>
            </div> 
            <div>
                {
                    search?.length > 0 ?
                        search?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                            <DrugsBar setdelet={setdelet} setGetItems={setGetItems} setreload={setreload} reload={reload} key={i} item={item} handleSearch={handleSearch} getsearch={getsearch} />
                        ))
                    : 
                    utils?.length > 0 ?
                        utils?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                            <DrugsBar setdelet={setdelet}  setGetItems={setGetItems} setreload={setreload} key={i} item={item} handleSearch={handleSearch} getsearch={getsearch} />
                        ))
                    : null
                }
            </div>

           {  getItems?.name &&
             <div style={{position:'absolute', width:'100%', height:'100%',  display:'flex', flexDirection:'column', backgroundColor:'transparent', top:'0', left:'0', alignItems:'center', justifyContent:'center'}}>
                <div style={{width:'700px', height:'fit-content', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding:'20px'}}>
                
                    <div className='patient_details_input_field1_'  >
                        <h4>DRUG NAME</h4>
                        <input style={{fontSize:'14px'}} value={drugname} placeholder={getItems?.name} onChange={handleDrugName} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>DRUG ORIGINAL PRICE</h4>
                        <input style={{fontSize:'14px'}} value={oprice} placeholder={getItems?.originalPrice} onChange={handleOprice} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>DRUG SELLING PRICE</h4>
                        <input style={{fontSize:'14px'}} value={sprice} placeholder={getItems?.sellingPrice} onChange={handleSprice} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>EXPIRING DATE {data(getItems?.expireDate)}</h4>
                        <input style={{fontSize:'14px'}} placeholder={getItems?.expireDate} type='date' onChange={handleExpDate} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>ORIGINAL QUANTITY</h4>
                        <input style={{fontSize:'14px'}} value={originalQuantity} placeholder={getItems?.originalQuantity} onChange={handleOrgQuantity} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>CURRENT QUANTITY</h4>
                        <input style={{fontSize:'14px'}} value={quantity} placeholder={getItems?.quantity} onChange={handleQuantity} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>BATCH</h4>
                        <input style={{fontSize:'14px'}} value={batch} placeholder={getItems?.batch} onChange={handleBatch} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>OS LIMIT</h4>
                        <input style={{fontSize:'14px'}} value={limit} placeholder={getItems?.limit} onChange={handleOsLimit} />
                    </div>
                    
                    <div className='patient_details_input_field1_' >
                        <h4>EXPIRING LIMIT {data(getItems?.explimit)}</h4>
                        <input style={{fontSize:'14px'}} value={explimit}  type='date' placeholder={getItems?.explimit} onChange={handleExpLimit} />
                    </div>
                    
                    <button className='add_staff_contaimer_button' onClick={()=>setGetItems('')} style={{color:'blue', background:'Whitesmoke'}}>CANCEL EDIT</button>
                </div>
             </div>
           }

           {  delet?.name &&
             <div style={{position:'absolute', width:'100%', height:'100%',  display:'flex', flexDirection:'column', backgroundColor:'transparent', top:'0', left:'0', alignItems:'center', justifyContent:'center'}}>
                <div style={{width:'400px', height:'300px', display:'flex', flexDirection:'column', backgroundColor:'cadetblue', padding:'20px'}}>
                
                    <div className='patient_details_input_field1_'  >
                        <h1>Want to Delete {delet?.name} ?</h1>
                    </div>
                    
                    <button className='add_staff_contaimer_button' onClick={handleDelete} style={{color:'white', background:'red'}}>CONFIRM</button>
                    <button className='add_staff_contaimer_button' onClick={()=>setdelet('')} style={{color:'blue', background:'Whitesmoke'}}>CANCEL EDIT</button>
                </div>
             </div>
           }
        </div>
    </div>
  )
}

export default SearchDrugs