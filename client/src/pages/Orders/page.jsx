import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { Plus, Filter, Download } from "lucide-react";
import axios from "axios";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import './style.css';

const Order = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [orders, setOrders] = useState([]);
  const tableRef = useRef(null);

  // Form fields
  const [product, setProduct] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderValue, setOrderValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);


  useEffect(() => {
    if (tableRef.current && orders.length > 0) {
      const tabulator = new Tabulator(tableRef.current, {
        data: orders,
        layout: "fitColumns",
        height: "auto",
        pagination: "local",
        paginationSize: 8,
        movableColumns: true,
        columns: [
          { title: "Order ID", field: "orderId" },
          { title: "Product", field: "product", headerFilter: true },
          { title: "Order Value", field: "value", sorter: "number", hozAlign: "left" },
          { title: "Quantity", field: "quantity" },
          { title: "Expected Delivery", field: "delivery", sorter: "date" },
          {
            title: "Status",
            field: "status",
            formatter: (cell) => {
              const status = cell.getValue();
              const colorMap = {
                DELAYED: "orange",
                CONFIRMED: "blue",
                RETURNED: "purple",
                OUT_FOR_DELIVERY: "green",
              };
              return `<span style="color: ${colorMap[status] || 'black'}; font-weight: 500;">${status}</span>`;
            },
          },
        ],
      });

      return () => tabulator.destroy();
    }
  }, [orders]);

  const handleAddOrder = async () => {
    try {
      await axios.post("http://localhost:3001/api/orders", {
        orderId,
        product,
        value: parseFloat(orderValue),
        quantity: `${quantity}`,
        delivery: new Date(deliveryDate),
        status: "CONFIRMED",
        categoryId: selectedCategory,
      });
      setOpenDialog(false);
      setProduct("");
      setOrderId("");
      setOrderValue("");
      setQuantity("");
      setBuyingPrice("");
      setDeliveryDate("");
      setSelectedCategory("");
      const res = await axios.get("http://localhost:3001/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to add order:", err);
    }
  };

  return (
    <div className="order-container">
      <Sidebar />
      <div className="order-main">
        <Header />
        <Box className="order-content">
          {/* Orders Header & Action Buttons */}
          <Box mt={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Orders</Typography>
              
              <Box display="flex" gap={2}>
                <Button variant="contained" onClick={() => setOpenDialog(true)}>Add Order</Button>
                <Button variant="outlined" startIcon={<Filter />}>Filters</Button>
                <Button variant="outlined" startIcon={<Download />}>Order History</Button>
              </Box>
            </Box>

            {/* Tabulator Table */}
            <Paper>
              <div ref={tableRef}></div>
            </Paper>
          </Box>
        </Box>

        {/* Add Order Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle>New Order</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <TextField label="Product Name" fullWidth value={product} onChange={(e) => setProduct(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Order ID" fullWidth value={orderId} onChange={(e) => setOrderId(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {Array.isArray(categories) && categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Order Value" fullWidth value={orderValue} onChange={(e) => setOrderValue(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Quantity" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Buying Price" fullWidth value={buyingPrice} onChange={(e) => setBuyingPrice(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Delivery"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={() => setOpenDialog(false)}>Discard</Button>
              <Button variant="contained" onClick={handleAddOrder}>Add Order</Button>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Order;
