import React, { useState } from 'react'
import PharmacyBar from '../../components/PharmacyBar'
import { useSelector } from 'react-redux';
import CartCard from './CartCard';
import { selectCartactualPrice, selectCartTotalPrice } from '../../features/cartSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { selectip } from '../../features/ipSlice'

function Cart() {
    //axios.defaults.withCredentials = true
        const ip = useSelector(selectip)
  const cartItems = useSelector(state => state.cart.items);
  
  const totalPrice = useSelector(selectCartTotalPrice);

  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(totalPrice);
  
  const actualPrice = useSelector(selectCartactualPrice);

  const formatted2 = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(actualPrice);

  const profit = totalPrice - actualPrice

  const formatted3 = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(profit);

  
    const [search, setsearch] = useState([])
    const [getpatient, setgetpatient] = useState('')
    const [getsearch, setgetsearch] = useState(getpatient || '')
    const [getpatientID, setgetpatientID] = useState('')

    const handleSearch = async(e) => {
        e.preventDefault()
        const searchQuery = e.target.value;
        setgetsearch(searchQuery)
        if (searchQuery.length > 0) {
            try {
                const value = {     
                    search : searchQuery
                }

                const response = await axios.post(`http://${'localhost'}:7700/search`, value);
                setsearch(response.data.patients) 
                
            } catch (err) {
                console.error('Error fetching search results', err);
            }
        } else {
            setsearch([]);
            setgetpatient('')
        }
    }

    
    const staffID = sessionStorage.getItem('staffID')
    const getid = JSON.parse(staffID)
    

    const handleSubmit=async()=>{
        const getservices = {
            totalPrice: totalPrice,
            actualPrice: actualPrice, 
            profit: profit,
            items: cartItems
        }
        const value ={
            uid : getpatientID,
            staffID: getid?._id,
            services: JSON.stringify(getservices),
            cartItems
        }

        try {
            await axios.post(`http://${'localhost'}:7700/sendBill`, value).then((res)=>{
                //console.log(res);
                
                if(res.data.status === 'success'){
                    toast.success('CHECK OUT SUCCESSFULL')
                    localStorage.removeItem('cart')
                    window.location.reload()
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='dashboard_container'>
        <PharmacyBar/> 
        <div className='dashboard_body cart_container_body' >
            <div className='cart_container' >
                <div className='drug_top_label' style={{width:'100%'}} >
                    <h4 style={{width:'25%', textAlign:'center'}} >UTILITY NAME</h4>
                    <h4 style={{width:'25%', textAlign:'center'}} >SELLING PRICE</h4>
                    <h4 style={{width:'25%', textAlign:'center'}} >QUANTITY</h4>
                    <h4 style={{width:'25%', textAlign:'center'}} >ACTION</h4>
                </div>
                <div>
                    {
                        cartItems?.length > 0 ?
                            cartItems?.map((item, i)=>(
                                <CartCard key={i} item={item} />
                            ))
                        : null
                    }
                </div>
            </div>

            <div className='cart_checkout' >
                <div className='sidebar_spacer' ></div>
              <div className='patient_details_input_field1_'>
                  <h4>PATIENT NAME</h4>
                  <input placeholder='Enter Patient Name' value={getsearch || getpatient} onChange={handleSearch} />

                  {
                    search?.length > 0 ?
                        <div className='cart_checkout_pateint_confirm' >
                            {
                                search?.map((item, i)=>(
                                    <div key={i}    
                                        onClick={()=>[
                                            setgetpatient(item?.name), 
                                            setgetpatientID(item?._id), 
                                            setsearch([]),
                                            setgetsearch('')
                                        ]} >
                                        <p>{item?.name}</p>
                                    </div>
                                ))
                            }
                        </div>
                    : null
                  }
              </div>
              <p>Select patient with this prescription</p>
              
              <h3>CHECK OUT</h3>

              {
                cartItems?.length > 0 ?
                    cartItems?.map((item, i)=>(
                        <div key={i} style={{margin:'5px 0'}} className='cart_checkout_price' >
                            <h4>{item?.name}</h4>
                            <h4>{item.quantity}</h4>
                        </div>
                    ))
                : null
              }
                
              <div className='cart_checkout_price' >
                <h3 style={{margin:'7px 0'}}>ACTUAL PRICE</h3>
                <h3 style={{margin:'7px 0'}}>{formatted2}</h3>
              </div>
                
              <div className='cart_checkout_price' >
                <h3 style={{margin:'7px 0'}}>TOTAL PRICE</h3>
                <h3 style={{margin:'7px 0'}}>{formatted}</h3>
              </div>
                
              <div className='cart_checkout_price' >
                <h3 style={{margin:'7px 0'}}>PROFIT</h3>
                <h3 style={{margin:'7px 0'}}>{formatted3}</h3>
              </div>

              {
                cartItems?.length > 0 && getpatient ?
                    <button className='custome_table_btn2' onClick={handleSubmit}>CHECK OUT NOW</button>
                :
                <button style={{opacity:.3}} className='custome_table_btn2'>CHECK OUT NOW</button>
              }
            </div>
        </div>
    </div>
  )
}

export default Cart