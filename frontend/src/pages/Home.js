import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import SpeedIcon from '@mui/icons-material/Speed';

const features = [
  {
    icon: <LocalDiningIcon fontSize="large" color="primary" />,
    title: 'Nutrition Optimization',
    description: 'Our AI analyzes your dietary preferences and suggests the healthiest options for your needs.'
  },
  {
    icon: <ShoppingCartIcon fontSize="large" color="primary" />,
    title: 'Smart Shopping',
    description: 'Get personalized product recommendations based on your preferences and purchase history.'
  },
  {
    icon: <SpeedIcon fontSize="large" color="primary" />,
    title: 'Price Optimization',
    description: 'Find the best deals and optimize your grocery budget with our intelligent pricing system.'
  }
];

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?grocery)',
          height: '60vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Increase the priority of the hero background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', py: 8 }}>
          <Typography component="h1" variant="h2" color="inherit" gutterBottom>
            Smart Grocery Shopping
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            AI-powered grocery shopping for better nutrition, optimal pricing, and personalized recommendations.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={RouterLink} 
            to="/register"
            sx={{ mt: 4 }}
          >
            Get Started
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Our Smart Features
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Discover how our AI-powered platform can transform your grocery shopping experience
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to transform your grocery shopping?
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph>
            Join thousands of smart shoppers who are saving money and eating healthier.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large" 
              component={RouterLink} 
              to="/register"
              sx={{ mx: 1 }}
            >
              Sign Up Now
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large" 
              component={RouterLink} 
              to="/login"
              sx={{ mx: 1 }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;