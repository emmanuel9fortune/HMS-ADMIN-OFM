import React, { useState } from 'react'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, editCartItem, removeFromCart } from '../../features/cartSlice'
import { toast } from 'react-toastify'

function DrugsBar({item, admin}) {        
    const dispatch = useDispatch()
    
    const cartItems = useSelector(state => state.cart.items);

    const getitem = cartItems?.find((items)=> items?.id === item?._id)

    const [days, setdays] = useState(getitem?.days || 1)
    const [time, settime] = useState(getitem?.time || '')
    const getTimes = time === '8hr' ? 3 : time === '12hr' ? 2 : time === '24hr' ? 1 : 0
    const getTimes2 = getitem?.time === '8hr' ? 3 : getitem?.time === '12hr' ? 2 : getitem?.time === '24hr' ? 1 : 0

    const subQuantity = getitem?.quantity/(getitem?.days * getTimes2)

    const [newQuantity, setnewQuantiry] = useState(subQuantity || 1)

    const calculateQuantity = newQuantity * getTimes * days

    const handleAddToCart = () => {
        if(days && time){
          const cartItem = {
            id: item?._id,
            name: item?.name,
            quantity: calculateQuantity,
            days: days,
            time: time,
            dosage: newQuantity,
            price: item?.sellingPrice,
            oprice: item?.originalPrice,
            actualPrice: calculateQuantity * item.originalPrice,
            totalPrice: calculateQuantity * item.sellingPrice,
          };
          dispatch(addToCart(cartItem));
        }else{
          toast.error('PLEASE FILL IN DAYS AND TIME FIELD')
        }
    };

    const handleInc = () => {      
      const updatedQty1 = (newQuantity + 1) * getTimes * days ;
      const updatedQty = newQuantity + 1;
      setnewQuantiry(updatedQty);
      dispatch(editCartItem({
        id: item?._id,
        quantity: updatedQty1,
        dosage: updatedQty,
        totalPrice: updatedQty1 * item.sellingPrice,
        actualPrice: updatedQty1 * item.originalPrice,
      }));
    };
    
    const handleDec = () => {
      if (newQuantity <= 1) return; // prevent going below 1
      const updatedQty1 = (newQuantity - 1) * getTimes * days;
      const updatedQty = newQuantity - 1;
      setnewQuantiry(updatedQty);
      dispatch(editCartItem({
        id: item?._id,
        quantity: updatedQty1,
        dosage: updatedQty,
        totalPrice: updatedQty1 * item.sellingPrice,
        actualPrice: updatedQty1 * item.originalPrice,
      }));
    };

      
    const handleRemove = () => {
      dispatch(removeFromCart(item?._id));
    };

    const date = new Date(Number(item?.expireDate * 1000))
    const day = date.getDate()
    const month = date.getMonth() 
    const year = date.getFullYear()



    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1

    const expires = item?.expireDate * 1000
    const today = expires >= start && expires <= end || expires < start



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
            <h4>{item?.name}</h4>
        </div>

        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <select value={time} onChange={(e)=>settime(e.target.value)} >
              <option value={''} >SELECT TIME</option>
              <option value={'8hr'} >8 HR</option>
              <option value={'12hr'} >12 HR</option>
              <option value={'24hr'} >24 HR</option>
            </select>
        </div>

        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <input value={days} onChange={(e)=>setdays(e.target.value)} type='number' placeholder='days' />
        </div>

        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
            <h4>{item?.quantity}</h4>
        </div>

          {
            <div className='Patientqueuecard_button' style={{width:'25%', justifyContent:'center'}}>
                <button onClick={handleDec} className='searchresultcard_view1' >
                  <FaMinus/>
                </button>

                <h4>{newQuantity}</h4>

                <button onClick={handleInc} className='searchresultcard_view2'>
                  <FaPlus/>
                </button>
            </div>
          }

          {
            
            <div className='Patientqueuecard_button' style={{width:'25%', justifyContent:'center'}}>
                <h4>{calculateQuantity}</h4>
            </div>
          }

        { 
            !today ?
              !getitem ?
                <button style={{width:'25%'}} onClick={handleAddToCart} className='ADD_Cart_btn'>PRESCRIBE</button>
              :
              <button style={{width:'25%', backgroundColor:'red'}} onClick={handleRemove} className='ADD_Cart_btn'>REMOVE</button>
            : 
            <button style={{width:'25%', opacity:'.3'}} onClick={()=> toast.error('CAN NOT ADD EXPIRED DRUGS')} className='ADD_Cart_btn'>EXPIRED</button>
        }
    </div>
  )
}

export default DrugsBar