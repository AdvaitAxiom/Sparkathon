import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider
} from '@mui/material';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all products
        const productsResponse = await axios.get('http://localhost:5000/api/admin/product');
        setProducts(productsResponse.data);
        
        // Get personalized recommendations
        const recommendationsResponse = await aiAPI.getRecommendations({
          userId: currentUser._id,
          preferences: currentUser.preferences
        });
        
        setRecommendations(recommendationsResponse.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {currentUser.name}!
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Recommended for You" />
          <Tab label="All Products" />
        </Tabs>
      </Paper>
      
      {tabValue === 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Based on your preferences
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {recommendations.length > 0 ? (
            <Grid container spacing={3}>
              {recommendations.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              We don't have enough data to make personalized recommendations yet. 
              Start shopping to get tailored suggestions!
            </Alert>
          )}
        </>
      )}
      
      {tabValue === 1 && (
        <>
          <Typography variant="h6" gutterBottom>
            All Available Products
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          {products.length > 0 ? (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No products available at the moment. Please check back later.
            </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default Dashboard;