import React, { createContext, useState, useEffect, useContext } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCart({ items: [] });
    }
  }, [currentUser]);

  const fetchCart = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await userAPI.getCart();
      setCart(response.data);
    } catch (err) {
      setError('Failed to fetch cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');
      await userAPI.addToCart({ productId, quantity });
      await fetchCart(); // Refresh cart after adding item
    } catch (err) {
      setError('Failed to add item to cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;