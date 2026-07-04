import React, { useState } from 'react'
import { addToCart, editCartItem, removeFromCart } from '../../features/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa';

function UtilsCard({item}) {

    const dispatch = useDispatch()
    
    const cartItems = useSelector(state => state.cart.items);
    

    const getitem = cartItems?.find((res)=> res?.id === item?._id)

    const [newQuantity, setnewQuantiry] = useState(getitem?.quantity || 1)

    const handleAddToCart = () => {
        const cartItem = {
          id: item?._id,
          name: item?.name,
          quantity: newQuantity,
          price: item?.sellingPrice,
          oprice: item?.originalPrice,
          actualPrice: newQuantity * item.originalPrice,
          totalPrice: newQuantity * item.sellingPrice,
        };
        dispatch(addToCart(cartItem));
    };
    
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(item?.sellingPrice);

    const handleInc = () => {      
        const updatedQty = newQuantity + 1;
        setnewQuantiry(updatedQty);
        dispatch(editCartItem({
          id: item?._id,
          quantity: updatedQty,
          totalPrice: updatedQty * item.sellingPrice,
          actualPrice: updatedQty * item.originalPrice,
        }));
      };
    
      const handleDec = () => {
        if (newQuantity <= 1) return; // prevent going below 1
        const updatedQty = newQuantity - 1;
        setnewQuantiry(updatedQty);
        dispatch(editCartItem({
          id: item?._id,
          quantity: updatedQty,
          totalPrice: updatedQty * item.sellingPrice,
          actualPrice: updatedQty * item.originalPrice,
        }));
      };

      
      const handleRemove = () => {
        dispatch(removeFromCart(item?._id));
      };
      
        

  return (
      <div className='recentpatientdashcard'>
  
          <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
              <h4>{item?.name}</h4>
          </div>
  
          <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
              <h4>{formatted}</h4>
          </div>
  
          <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
              <h4>{item?.quantity}</h4>
          </div>
  
          <div className='Patientqueuecard_button' style={{width:'25%', justifyContent:'center'}}>
            <button onClick={handleDec} className='searchresultcard_view1' >
                <FaMinus/>
            </button>
  
              <h4>{newQuantity}</h4>
  
              <button onClick={handleInc} className='searchresultcard_view2'>
                <FaPlus/>
              </button>
          </div>
  
          { 
            !getitem ?
            <button style={{width:'25%'}} onClick={handleAddToCart} className='ADD_Cart_btn'>ADD TO CART</button>
            :
            <button style={{width:'25%', backgroundColor:'red'}} onClick={handleRemove} className='ADD_Cart_btn'>REMOVE</button>
          }
      </div>
  )
}

export default UtilsCard