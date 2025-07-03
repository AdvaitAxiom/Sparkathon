import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { adminAPI } from '../services/api';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Product form state
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    brand: '',
    quantity: '',
    unit: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [productFormLoading, setProductFormLoading] = useState(false);
  
  // Inventory form state
  const [openInventoryDialog, setOpenInventoryDialog] = useState(false);
  const [inventoryFormData, setInventoryFormData] = useState({
    productId: '',
    quantity: '',
    location: ''
  });
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [inventoryFormLoading, setInventoryFormLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch products
        const productsResponse = await axios.get('http://localhost:5000/api/admin/product');
        setProducts(productsResponse.data);
        
        // Fetch inventory
        const inventoryResponse = await axios.get('http://localhost:5000/api/admin/inventory');
        setInventory(inventoryResponse.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Product form handlers
  const handleOpenProductDialog = (product = null) => {
    if (product) {
      setProductFormData({
        name: product.name,
        price: product.price,
        brand: product.brand,
        quantity: product.quantity,
        unit: product.unit
      });
      setEditingProductId(product._id);
    } else {
      setProductFormData({
        name: '',
        price: '',
        brand: '',
        quantity: '',
        unit: ''
      });
      setEditingProductId(null);
    }
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: value
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      setProductFormLoading(true);
      
      // Convert numeric fields
      const formattedData = {
        ...productFormData,
        price: parseFloat(productFormData.price),
        quantity: parseFloat(productFormData.quantity)
      };
      
      let response;
      if (editingProductId) {
        // Update existing product
        response = await adminAPI.updateProduct(editingProductId, formattedData);
        
        // Update products list
        setProducts(products.map(product => 
          product._id === editingProductId ? response.data : product
        ));
      } else {
        // Create new product
        response = await adminAPI.createProduct(formattedData);
        
        // Add to products list
        setProducts([...products, response.data]);
      }
      
      handleCloseProductDialog();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
    } finally {
      setProductFormLoading(false);
    }
  };

  // Inventory form handlers
  const handleOpenInventoryDialog = (inventoryItem = null) => {
    if (inventoryItem) {
      setInventoryFormData({
        productId: inventoryItem.productId,
        quantity: inventoryItem.quantity,
        location: inventoryItem.location
      });
      setEditingInventoryId(inventoryItem._id);
    } else {
      setInventoryFormData({
        productId: '',
        quantity: '',
        location: ''
      });
      setEditingInventoryId(null);
    }
    setOpenInventoryDialog(true);
  };

  const handleCloseInventoryDialog = () => {
    setOpenInventoryDialog(false);
  };

  const handleInventoryFormChange = (e) => {
    const { name, value } = e.target;
    setInventoryFormData({
      ...inventoryFormData,
      [name]: value
    });
  };

  const handleSubmitInventory = async (e) => {
    e.preventDefault();
    try {
      setInventoryFormLoading(true);
      
      // Convert numeric fields
      const formattedData = {
        ...inventoryFormData,
        quantity: parseInt(inventoryFormData.quantity)
      };
      
      let response;
      if (editingInventoryId) {
        // Update existing inventory
        response = await adminAPI.updateInventory(editingInventoryId, formattedData);
        
        // Update inventory list
        setInventory(inventory.map(item => 
          item._id === editingInventoryId ? response.data : item
        ));
      } else {
        // Create new inventory
        response = await adminAPI.createInventory(formattedData);
        
        // Add to inventory list
        setInventory([...inventory, response.data]);
      }
      
      handleCloseInventoryDialog();
    } catch (err) {
      console.error('Error saving inventory:', err);
      setError('Failed to save inventory. Please try again.');
    } finally {
      setInventoryFormLoading(false);
    }
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
        Admin Dashboard
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
          <Tab label="Products" />
          <Tab label="Inventory" />
        </Tabs>
      </Paper>
      
      {/* Products Tab */}
      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Products</Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenProductDialog()}
            >
              Add Product
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenProductDialog(product)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No products found. Add your first product!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Product Form Dialog */}
          <Dialog open={openProductDialog} onClose={handleCloseProductDialog} maxWidth="sm" fullWidth>
            <DialogTitle>{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <form onSubmit={handleSubmitProduct}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Product Name"
                      fullWidth
                      value={productFormData.name}
                      onChange={handleProductFormChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="brand"
                      label="Brand"
                      fullWidth
                      value={productFormData.brand}
                      onChange={handleProductFormChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="price"
                      label="Price"
                      type="number"
                      fullWidth
                      value={productFormData.price}
                      onChange={handleProductFormChange}
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      fullWidth
                      value={productFormData.quantity}
                      onChange={handleProductFormChange}
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="unit"
                      label="Unit"
                      fullWidth
                      value={productFormData.unit}
                      onChange={handleProductFormChange}
                      required
                      placeholder="e.g., oz, lb, each"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseProductDialog}>Cancel</Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={productFormLoading}
                >
                  {productFormLoading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </>
      )}
      
      {/* Inventory Tab */}
      {tabValue === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Manage Inventory</Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenInventoryDialog()}
            >
              Add Inventory
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.length > 0 ? (
                  inventory.map((item) => {
                    const product = products.find(p => p._id === item.productId) || {};
                    return (
                      <TableRow key={item._id}>
                        <TableCell>{product.name || 'Unknown Product'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenInventoryDialog(item)}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No inventory records found. Add your first inventory!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Inventory Form Dialog */}
          <Dialog open={openInventoryDialog} onClose={handleCloseInventoryDialog} maxWidth="sm" fullWidth>
            <DialogTitle>{editingInventoryId ? 'Edit Inventory' : 'Add New Inventory'}</DialogTitle>
            <form onSubmit={handleSubmitInventory}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      name="productId"
                      label="Product"
                      fullWidth
                      value={inventoryFormData.productId}
                      onChange={handleInventoryFormChange}
                      required
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      fullWidth
                      value={inventoryFormData.quantity}
                      onChange={handleInventoryFormChange}
                      required
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="location"
                      label="Location"
                      fullWidth
                      value={inventoryFormData.location}
                      onChange={handleInventoryFormChange}
                      required
                      placeholder="e.g., Warehouse A, Shelf B3"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseInventoryDialog}>Cancel</Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={inventoryFormLoading}
                >
                  {inventoryFormLoading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;