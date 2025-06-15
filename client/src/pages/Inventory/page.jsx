import { useState, useEffect, forwardRef} from "react";
import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import "./style.css";
import ProductTable from '../../components/ProductTable/page';
import AddProductDialog from "../../components/Add-Product/page";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Grid, Typography, Box, Button, Paper, TextField, InputAdornment } from "@mui/material";
import { Boxes, PackageCheck, TrendingDown, AlertTriangle, Plus, Search, Filter, Download} from "lucide-react";
import axios from "axios";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleProductAdded = () => {
    setSnackbarMessage("Product added successfully!");
    setSnackbarOpen(true);
  
    axios.get("http://localhost:3001/api/products")
    . then((res) => {
    setProducts(res.data);
  })
      .catch((error) => {
        console.error("Error fetching updated products:", error);
      });
  };
  

  useEffect(() => {
    axios.get("http://localhost:3001/api/products")
      .then((res) => {
        setProducts(res.data); // only set actual data
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);
  

  const stats = [
    {
      label: "Total Categories",
      value: 8,
      icon: <Boxes color="#3b82f6" />,
      sub: "Last 7 Days",
    },
    {
      label: "Total Products",
      value: 120,
      icon: <PackageCheck color="#10b981" />,
      sub: "Last 7 Days",
    },
    {
      label: "Low Stock",
      value: 5,
      icon: <TrendingDown color="#f59e0b" />,
      sub: "Last 7 Days",
    },
    {
      label: "Out Of Stock",
      value: 3,
      icon: <AlertTriangle color="#ef4444" />,
      sub: "Last 7 Days",
    },
  ];

  return (
    <div className="inventory-container">
      <Sidebar />
      <div className="inventory-main">
        <Header />

        <Box className="inventory-content">
          {/* Page Header */}
          <Box className="inventory-header">
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Overall Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your product inventory efficiently
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Plus />}
              className="add-product-btn"
              onClick={() => setOpenDialog(true)}
            >
              Add Product
            </Button>
          </Box>

          {/* Stat Cards */}
          <Box display="flex" justifyContent="center">
            <Grid container spacing={3} className="stat-grid">
              {stats.map((stat, index) => (
                <Grid
                  xs={12}
                  sm={6}
                  md={3}
                  key={index}
                  display="flex"
                  justifyContent="center"
                >
                  <Paper className="stat-card" elevation={1}>
                    <Box className="stat-card-header">
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        {stat.label}
                      </Typography>
                      {stat.icon}
                    </Box>
                    <Box className="stat-card-body">
                      <Typography variant="h5" fontWeight={600}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.sub}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Product Table Card */}
          <Box ml={4} mt={4} mr={4}>
            <Paper elevation={2} sx={{ borderRadius: 2, padding: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                mb={2}
              >
                <Typography variant="h6" fontWeight="bold" >
                  Products
                </Typography>

                <Box display="flex" gap={2} flexWrap="wrap">
                  <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Search products..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={18} />
                        </InputAdornment>
                      ),
                      style: { borderRadius: 8 },
                    }}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<Filter size={18} />}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Filters
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Download size={18} />}
                    sx={{ textTransform: "none", borderRadius: 2}}
                  >
                    Download all
                  </Button>
                </Box>
              </Box>

              {/* Product Table */}
              <Paper elevation={3}>
              <ProductTable products={products} />
              </Paper>
            </Paper>
          </Box>
        </Box>
        <AddProductDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={handleProductAdded}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </div>
    </div>
  );
};

export default Inventory;
