import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Profile from './pages/Profile';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green
    },
    secondary: {
      main: '#f57c00', // Orange
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected user routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected admin routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
