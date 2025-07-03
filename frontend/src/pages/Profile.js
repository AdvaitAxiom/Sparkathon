import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  CircularProgress,
  Divider,
  Tabs,
  Tab
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

const Profile = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    preferences: {
      dietaryGoals: currentUser?.preferences?.dietaryGoals || [],
      allergies: currentUser?.preferences?.allergies || [],
      deliverySpeed: currentUser?.preferences?.deliverySpeed || 'Standard'
    }
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value
        }
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  const handleMultiSelectChange = (e, field) => {
    const { value } = e.target;
    setProfileData({
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [field]: value
      }
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      
      // Update profile in backend
      await axios.put('http://localhost:5000/api/user/profile', profileData);
      
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
      // Update password in backend
      await axios.put('http://localhost:5000/api/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password updated successfully!');
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Profile Information" />
          <Tab label="Change Password" />
        </Tabs>
      </Paper>
      
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {/* Profile Information Tab */}
      {tabValue === 0 && (
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleUpdateProfile}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Full Name"
                  fullWidth
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Preferences
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="dietary-goals-label">Dietary Goals</InputLabel>
                  <Select
                    labelId="dietary-goals-label"
                    multiple
                    value={profileData.preferences.dietaryGoals}
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
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="allergies-label">Allergies</InputLabel>
                  <Select
                    labelId="allergies-label"
                    multiple
                    value={profileData.preferences.allergies}
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
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="delivery-speed-label">Delivery Speed</InputLabel>
                  <Select
                    labelId="delivery-speed-label"
                    name="preferences.deliverySpeed"
                    value={profileData.preferences.deliverySpeed}
                    onChange={handleProfileChange}
                    label="Delivery Speed"
                  >
                    {DELIVERY_SPEEDS.map((speed) => (
                      <MenuItem key={speed} value={speed}>
                        {speed}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}
      
      {/* Change Password Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleUpdatePassword}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  fullWidth
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="newPassword"
                  label="New Password"
                  type="password"
                  fullWidth
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Password'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}
    </Container>
  );
};

export default Profile;