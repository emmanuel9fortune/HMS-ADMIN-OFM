import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { editCartItem, removeFromCart } from '../../features/cartSlice';

function CartCard({item}) {

//   const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const [newQuantity, setNewQuantity] = useState(item?.quantity || 1);

  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(item?.price);

  const handleRemove = () => {
    dispatch(removeFromCart(item?.id));
  };

  const handleInc = () => {
    const updatedQty = newQuantity + 1;
    setNewQuantity(updatedQty);
    dispatch(editCartItem({
      id: item?.id,
      quantity: updatedQty,
      totalPrice: updatedQty * item.price,
      actualPrice: updatedQty * item.oprice,
    }));
  };

  const handleDec = () => {
    if (newQuantity <= 1) return; // prevent going below 1
    const updatedQty = newQuantity - 1;
    setNewQuantity(updatedQty);
    dispatch(editCartItem({
      id: item?.id,
      quantity: updatedQty,
      totalPrice: updatedQty * item.price,
      actualPrice: updatedQty * item.oprice,
    }));
  };

  return (
    <div className='recentpatientdashcard'>
        <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                <h4>{item?.name}</h4>
            </div>
    
            <div className='recentpatientdashcard_desc' style={{width:'25%', textAlign:'center'}}>
                <h4>{formatted}</h4>
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
    
            <button style={{width:'25%', backgroundColor:'red'}} onClick={handleRemove} className='ADD_Cart_btn'>REMOVE</button>
               
    </div>
  )
}

export default CartCard