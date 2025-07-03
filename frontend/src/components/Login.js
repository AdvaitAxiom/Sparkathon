import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  FormControlLabel, 
  Checkbox,
  Alert,
  CircularProgress
} from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, error: authError, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password, isAdmin);
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Auth context already handles the error
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        
        {(localError || authError) && (
          <Alert severity="error">{localError || authError}</Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                checked={isAdmin} 
                onChange={(e) => setIsAdmin(e.target.checked)} 
              />
            }
            label="Login as Admin"
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button 
              color="primary" 
              onClick={() => navigate('/register')}
              sx={{ p: 0, minWidth: 'auto' }}
            >
              Register
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;