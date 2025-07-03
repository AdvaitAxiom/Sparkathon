import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  CircularProgress
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';

const ProductCard = ({ product, onEdit }) => {
  const { addToCart, loading } = useCart();
  const { isAdmin } = useAuth();
  
  const handleAddToCart = () => {
    addToCart(product._id, 1);
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {product.brand}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {product.quantity} {product.unit}
          </Typography>
        </Box>
        
        {product.nutritionScore && (
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={`Nutrition Score: ${product.nutritionScore}`}
              color={product.nutritionScore > 7 ? 'success' : product.nutritionScore > 4 ? 'warning' : 'error'}
              size="small"
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        {isAdmin ? (
          <Button 
            startIcon={<EditIcon />}
            size="small" 
            onClick={() => onEdit(product)}
            fullWidth
          >
            Edit
          </Button>
        ) : (
          <Button
            startIcon={loading ? <CircularProgress size={20} /> : <AddShoppingCartIcon />}
            variant="contained"
            size="small"
            onClick={handleAddToCart}
            disabled={loading}
            fullWidth
          >
            Add to Cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;