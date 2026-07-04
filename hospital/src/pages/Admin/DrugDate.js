import React, { useEffect, useState } from 'react'
import AdminBar from '../../components/AdminBar'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios'
import ManageMentBar from '../pharmacy/ManageMentBar'
import { useSelector } from 'react-redux'
import { selectinfo } from '../../features/infoSlice'

function DrugDate() { 
    
    const info = useSelector(selectinfo)
        
    const [utils, setutils] = useState([])
    const cip = window.location.hostname
    const [sort, setsort] = useState('')
    const [batch, setbatch] = useState('')

    useEffect(()=>{
        const controller = new AbortController()
        const func =async()=>{
            try {
                await axios.post(`http://${cip || 'localhost'}:7700/getUtils`, {signal: controller.signal}).then((res)=>{                                    
                    if(res.data.status === 'success'){
                        setutils(res.data.utils)
                    }
                }) 
            } catch (error) {
                console.log(error);
            }
        }
        func() 
        return ()=> controller.abort()
    },[cip, sort, batch])
    
      
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
    
                    const response = await axios.post(`http://${cip || 'localhost'}:7700/searchutils`, value);
                    setsearch(response.data.utils)                 
                    
                } catch (err) {
                    console.error('Error fetching search results', err);
                }
            } else {
                setsearch([]);
            }
        }


        const [profit, setprofit] = useState()
        const [actual, setactual] = useState()
        const [sell, setsell] = useState()
    
        
        useEffect(()=>{
            let proftotal = 0
            let acttotal = 0
            let selltotal = 0
    
            utils?.forEach(item =>{   
                const sold = item?.originalQuantity - item?.quantity
                if(sort === item?.type){
                    proftotal += (item?.sellingPrice * sold) - (item?.originalPrice * sold)
                    acttotal += item?.originalPrice * sold
                    selltotal += item?.sellingPrice * sold
                }else if(batch === item?.batch){
                    proftotal += (item?.sellingPrice * sold) - (item?.originalPrice * sold)
                    acttotal += item?.originalPrice * sold
                    selltotal += item?.sellingPrice * sold
                }else if(batch === item?.batch && sort === item?.type){
                    proftotal += (item?.sellingPrice * sold) - (item?.originalPrice * sold)
                    acttotal += item?.originalPrice * sold
                    selltotal += item?.sellingPrice * sold
                }else if(!batch && !sort){
                    proftotal += (item?.sellingPrice * sold) - (item?.originalPrice * sold)
                    acttotal += item?.originalPrice * sold
                    selltotal += item?.sellingPrice * sold
                }
            })
            
            setprofit(proftotal)
            setactual(acttotal)
            setsell(selltotal)

        },[batch, sort, utils])
        
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })

  return (
    <div className='dashboard_container'>
         <AdminBar/> 
        <div className='dashboard_body' >
            <div className='dashboard_body_header' >
                <div className='dashboard_body_header_search'>
                    <FaSearch/>
                    <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                </div>
                <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                    <h4>CHOOSE SERVICES</h4>
                    <select onChange={(e)=>setsort(e.target.value)} >
                        <option value={''}>ALL</option>
                        <option value={'drugs'} >DRUGS</option>
                        <option value={'utils'}>UTILITIES </option>
                        <option value={'consumable'}>CONSUMABLES</option>
                    </select>
                </div>
                
                <div className='patient_details_input_field1_' style={{margin:'0 5px'}}>
                    <h4>CHOOSE BATCH</h4>
                    <select onChange={(e)=>setbatch(e.target.value)} >
                        <option value={''}>ALL</option>
                        {
                            info?.batches?.map((res)=>(
                                <option value={res} >{res}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div>
                <h2 style={{color:'blue'}}>Total Selling Price {formatted.format(sell)}</h2>
                <h2 style={{color:'orange'}}>Total Buy Price {formatted.format(actual)}</h2>
                <h2 style={{color:'green'}}>Total Profit {formatted.format(profit)}</h2>
            </div>

            {
                search?.length > 0 ?
                <h3>SEARCH RESULTS</h3>
                : 
                <h3>STOCK MANAGEMENT</h3>
            }
            <div className='drug_top_label' style={{width:'100%'}} >
                <h4 style={{width:'25%', textAlign:'center'}} >EXPIRES ON</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >NAMES</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >BUY PRICE</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >SELL PRICE</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >AMT LEFT</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >AMT SOLD</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >SELL COST</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >BUY COST</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >PROFITS</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >LOSSES</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >BATCH</h4>
            </div>

            <div>
                
                {
                    search?.length > 0 ?
                        search?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                            <ManageMentBar key={i} item={item} sort={sort} batch={batch} />
                        ))
                    : 
                    utils?.length > 0 ?
                        utils?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                            <ManageMentBar key={i} item={item} sort={sort} batch={batch} />
                        ))
                    : null
                }
            </div>
        </div>
    </div>
  )
}

export default DrugDate