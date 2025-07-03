import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const Cart = () => {
  const { cart, loading: cartLoading, error: cartError, fetchCart } = useCart();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (cart.items && cart.items.length > 0) {
          // Get all product IDs from cart
          const productIds = cart.items.map(item => item.productId);
          
          // Fetch product details for all items in cart
          const productsResponse = await axios.post('http://localhost:5000/api/admin/products/batch', {
            productIds
          });
          
          // Create a map of product ID to product details
          const productsMap = {};
          productsResponse.data.forEach(product => {
            productsMap[product._id] = product;
          });
          
          setProducts(productsMap);
          
          // Initialize quantities state
          const initialQuantities = {};
          cart.items.forEach(item => {
            initialQuantities[item.productId] = item.quantity;
          });
          setQuantities(initialQuantities);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (cart.items) {
      fetchProducts();
    }
  }, [cart]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      // Update quantity in local state
      setQuantities({
        ...quantities,
        [productId]: newQuantity
      });
      
      // Update cart in backend
      await axios.put('http://localhost:5000/api/user/cart/update', {
        productId,
        quantity: newQuantity
      });
      
      // Refresh cart
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      // Remove item from cart in backend
      await axios.delete(`http://localhost:5000/api/user/cart/${productId}`);
      
      // Refresh cart
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const calculateTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    
    return cart.items.reduce((total, item) => {
      const product = products[item.productId];
      if (!product) return total;
      return total + (product.price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (loading || cartLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Shopping Cart
      </Typography>
      
      {(error || cartError) && <Alert severity="error" sx={{ mb: 3 }}>{error || cartError}</Alert>}
      
      {(!cart.items || cart.items.length === 0) ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add some products to your cart to see them here.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/dashboard')}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => {
                  const product = products[item.productId];
                  if (!product) return null;
                  
                  return (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="subtitle1">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.brand}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item.productId, quantities[item.productId] - 1)}
                            disabled={quantities[item.productId] <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            value={quantities[item.productId]}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                handleQuantityChange(item.productId, value);
                              }
                            }}
                            inputProps={{ 
                              min: 1, 
                              style: { textAlign: 'center', width: '40px' } 
                            }}
                            variant="outlined"
                          />
                          <IconButton 
                            size="small"
                            onClick={() => handleQuantityChange(item.productId, quantities[item.productId] + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${(product.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="error"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Paper sx={{ p: 3, width: '100%', maxWidth: 400 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${calculateTotal().toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>$0.00</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax</Typography>
                <Typography>${(calculateTotal() * 0.08).toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  ${(calculateTotal() + (calculateTotal() * 0.08)).toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<ShoppingCartCheckoutIcon />}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart;