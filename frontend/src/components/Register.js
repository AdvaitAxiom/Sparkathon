import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput
} from '@mui/material';

const DIETARY_GOALS = [
  'Weight Loss',
  'Muscle Gain',
  'Heart Health',
  'Diabetes Management',
  'Vegan',
  'Vegetarian',
  'Keto',
  'Paleo'
];

const ALLERGIES = [
  'Nuts',
  'Dairy',
  'Gluten',
  'Shellfish',
  'Eggs',
  'Soy',
  'Fish'
];

const DELIVERY_SPEEDS = [
  'Standard',
  'Express',
  'Same Day'
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {
      dietaryGoals: [],
      allergies: [],
      deliverySpeed: 'Standard'
    }
  });
  
  const [localError, setLocalError] = useState('');
  const { register, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleMultiSelectChange = (e, field) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      // Auth context already handles the error
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        py: 4
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Create an Account
        </Typography>
        
        {(localError || authError) && (
          <Alert severity="error">{localError || authError}</Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Preferences
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="dietary-goals-label">Dietary Goals</InputLabel>
            <Select
              labelId="dietary-goals-label"
              multiple
              value={formData.preferences.dietaryGoals}
              onChange={(e) => handleMultiSelectChange(e, 'dietaryGoals')}
              input={<OutlinedInput id="dietary-goals" label="Dietary Goals" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {DIETARY_GOALS.map((goal) => (
                <MenuItem key={goal} value={goal}>
                  {goal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="allergies-label">Allergies</InputLabel>
            <Select
              labelId="allergies-label"
              multiple
              value={formData.preferences.allergies}
              onChange={(e) => handleMultiSelectChange(e, 'allergies')}
              input={<OutlinedInput id="allergies" label="Allergies" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {ALLERGIES.map((allergy) => (
                <MenuItem key={allergy} value={allergy}>
                  {allergy}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="delivery-speed-label">Delivery Speed</InputLabel>
            <Select
              labelId="delivery-speed-label"
              name="preferences.deliverySpeed"
              value={formData.preferences.deliverySpeed}
              onChange={handleChange}
              label="Delivery Speed"
            >
              {DELIVERY_SPEEDS.map((speed) => (
                <MenuItem key={speed} value={speed}>
                  {speed}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Button
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ p: 0, minWidth: 'auto' }}
            >
              Login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;