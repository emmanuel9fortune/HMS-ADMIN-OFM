import { createSlice } from '@reduxjs/toolkit';

const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem('cart');
  return savedCart ? JSON.parse(savedCart) : { items: [] };
};

const saveCartToLocalStorage = (items) => {
  localStorage.setItem('cart', JSON.stringify({ items }));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromLocalStorage(),
  reducers: {
    addToCart(state, action) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
  
      if (!existingItem) {
        state.items.push(action.payload);
        saveCartToLocalStorage(state.items);
      }
    },
    emptyCart(state, action) {
      state.items = [];
      saveCartToLocalStorage(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state.items);
    },
    editCartItem(state, action) {
      const { id, quantity, totalPrice, actualPrice } = action.payload;
      const index = state.items.findIndex(item => item.id === id);

      if (index !== -1) {
        // ✅ update directly via index — ensures mutation is tracked
        state.items[index] = {
          ...state.items[index],
          quantity,
          totalPrice,
          actualPrice,
        };

        saveCartToLocalStorage(state.items);
      }
    }
  },
});
export const selectCartTotalPrice = (state) => {
  return state.cart.items.reduce((total, item) => total + item.totalPrice, 0);
};
export const selectCartactualPrice = (state) => {
  return state.cart.items.reduce((total, item) => total + item.actualPrice, 0);
};
export const { addToCart, editCartItem, removeFromCart, emptyCart } = cartSlice.actions; 
export default cartSlice.reducer;
