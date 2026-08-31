import React, { useEffect, useState } from 'react'
import { FaSearch, FaShoppingBasket } from 'react-icons/fa'
import DrugsBar from '../doctor/DrugsBar'
import PharmacyBar from '../../components/PharmacyBar'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { selectip } from '../../features/ipSlice'

function Dispenser() {

    //axios.defaults.withCredentials = true
        const ip = useSelector(selectip)
    
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

                const response = await axios.post(`http://${'localhost'}:7700/searchutils`, value);
                setsearch(response.data.utils)                 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
        }
    }

  const cartItems = useSelector(state => state.cart.items);

  const navigate = useNavigate()

  const [utils, setutils] = useState([])

  useEffect(()=>{
    const func =async()=>{
        try {
            await axios.post(`http://${'localhost'}:7700/getUtils`).then((res)=>{                
                if(res.data.status === 'success'){
                    setutils(res.data.utils)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    func()
  },[ip])

  return (
    <div className='dashboard_container'>
        <PharmacyBar/> 
        <div className='dashboard_body' >
            <div className='dashboard_body_header' >
                <div className='dashboard_body_header_search'>
                    <FaSearch/>
                    <input value={getsearch} onChange={handleSearch} placeholder='Search' />
                </div>
                
                <div className='dashboard_body_header_displays' style={{cursor:'pointer'}} onClick={()=> navigate('/cart')} >
                    <div className='dashboard_body_header_displays_icon' >
                    <FaShoppingBasket size={25} color="#0463ca" />
                    </div>
                    <div className='dashboard_body_header_displays_text'>
                    <h1>{cartItems?.length}</h1>
                    <p>View Cart</p>
                    </div>
                </div>
            </div>

            {
                search?.length > 0 ?
                <h3>SEARCH RESULTS</h3>
                : 
                <h3>DRUGS AND UTILITIES</h3>
            }
            <div className='drug_top_label' style={{width:'100%'}} >
                <h4 style={{width:'25%', textAlign:'center'}} >EXPIRES ON</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >UTILITY NAME</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >SELLING PRICE</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >AMOUNT LEFT</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >QUANTITY</h4>
                <h4 style={{width:'25%', textAlign:'center'}} >ACTION</h4>
            </div>
            <div>
                {
                    search?.length > 0 ?
                        search?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                            <DrugsBar key={i} item={item}/>
                        ))
                    : 
                    utils?.length > 0 ?
                        utils?.sort((a, b)=> a.expireDate - b.expireDate).map((item, i)=>(
                            <DrugsBar key={i} item={item}/>
                        ))
                    : null
                }
            </div>
        </div>
    </div>
  )
}

export default Dispenser