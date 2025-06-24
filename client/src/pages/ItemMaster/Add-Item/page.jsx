import { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar/page";
import Header from "../../../components/header/page";
import './style.css';
import axios from "axios";
import { useNavigate } from "react-router-dom"
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Paper,
  Grid
} from "@mui/material";

const AddItemPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [specification, setSpecification] = useState("");
  const [brand, setBrand] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [minStockLevel, setMinStockLevel] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [gstRate, setGstRate] = useState("");



  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/categories")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.categories ?? [];
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);

    const categoryData = categories.find(cat => cat.name === selected);
    setSubcategories(categoryData?.subcategories || []);
    setSelectedSubcategory("");
  };

  const handleSubmit = async () => {
    try {
      const categoryObj = categories.find(c => c.name === selectedCategory);
      const subcategoryObj = subcategories.find(sc => sc.name === selectedSubcategory);
      if (!categoryObj || !subcategoryObj) {
        alert("Please select a valid category and subcategory.");
        return;
      }

      const payload = {
        name: itemName,
        productId: itemCode,
        categoryId: categoryObj?.id,
        subcategoryId: subcategoryObj?.id,
        specification,
        brand,
        invoiceDate,
        expiryDate,
        unitOfMeasurement,
        openingStock: Number(openingStock),
        asOnDate,
        minStockLevel: Number(minStockLevel),
        unitPrice: parseFloat(unitPrice),
        gstRate: parseFloat(gstRate),
      };

      const res = await axios.post("http://localhost:3001/api/items", payload);
      if (res.data.success) {

        setTimeout(() => {
          navigate("/ItemMaster", {
            state: { message: "Item added successfully!" }
          });
        }, 1500);
      } 
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong.");
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSubcategories([]);
    setSelectedSubcategory("");
    setUnitOfMeasurement("");
    setItemName("");
    setItemCode("");
    setSpecification("");
    setBrand("");
    setInvoiceDate("");
    setExpiryDate("");
    setOpeningStock("");
    setAsOnDate("");
    setMinStockLevel("");
    setUnitPrice("");
    setGstRate("");
  };



  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <Typography variant="h5" fontWeight="Bold" gutterBottom>
            Add Item
          </Typography>

          {/* Item Info Section */}
          <Paper elevation={1} style={{ padding: "24px", marginBottom: "24px" }}>
            <Typography variant="h6" gutterBottom>
              Item Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Item Name" fullWidth sx={{ minWidth: 250 }}  value={itemName} onChange={(e) => setItemName(e.target.value)}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Item Code" fullWidth sx={{ minWidth: 250 }}  value={itemCode} onChange={e => setItemCode(e.target.value)}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  select
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sub Category"
                  select
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={!selectedCategory}
                >
                  {subcategories.map((sub) => (
                    <MenuItem key={sub.id} value={sub.name}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Specification" fullWidth sx={{ minWidth: 250 }} value={specification} onChange={e => setSpecification(e.target.value)}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Brand" fullWidth sx={{ minWidth: 250 }} value={brand} onChange={e => setBrand(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Invoice Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expiry Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>


          <Paper elevation={1} style={{ padding: "24px", marginBottom: "24px" }}>
            <Typography variant="h6" gutterBottom>
              Unit of Measurement
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  value={unitOfMeasurement}

                  onChange={(e) => setUnitOfMeasurement(e.target.value)}
                  sx={{ minWidth: 250 }}
                >
                  <MenuItem value="Select UOM" disabled>
                    Select UOM
                  </MenuItem>
                  <MenuItem value="pcs">Pieces</MenuItem>
                  <MenuItem value="kg">Kilograms</MenuItem>
                  <MenuItem value="g">Grams</MenuItem>
                  <MenuItem value="ltr">Litres</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          {/* Stock Details Section */}
          <Paper elevation={1} style={{ padding: "24px", marginBottom: "24px", borderRadius: "12px" }}>
            <Typography variant="h6" gutterBottom>
              Stock Details
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Opening Stock"
                  placeholder="Enter opening stock"
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={openingStock} onChange={e => setOpeningStock(e.target.value)} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="As on Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={asOnDate} onChange={e => setAsOnDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Minimum Stock Level"
                  placeholder="Enter minimum stock level"
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={minStockLevel} onChange={e => setMinStockLevel(e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={1} style={{ padding: "24px", marginBottom: "24px", borderRadius: "12px" }}>
            <Typography variant="h6" gutterBottom>
              Price Details
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Unit Price"
                  placeholder="Enter Unit Price"
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={unitPrice} onChange={e => setUnitPrice(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="GST Rate"
                  placeholder="Enter GST Rate"
                  fullWidth
                  sx={{ minWidth: 250 }}
                  value={gstRate}
                  onChange={e => setGstRate(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Button Section */}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" color="inherit" onClick={() => navigate("/ItemMaster")}>
                Go Back
              </Button>
              <Button variant="outlined" color="inherit" onClick={resetForm}>
                Reset
              </Button>
              <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "black", color: "white", '&:hover': { backgroundColor: '#333' } }}>
                Save Details
              </Button>
            </Box>
          </Paper>

        </div>
      </div>
    </div>
  );
};

export default AddItemPage;
