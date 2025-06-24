import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import { Button, Dialog, DialogTitle, DialogContent, TextField, Grid, Box, Typography } from "@mui/material";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import './style.css';

const Customer = () => {
  const tableRef = useRef(null);
  const tabulatorInstance = useRef(null);
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "", customerId: "", contact: "", email: "", product: "", price: "", date: "", customerType: ""
  });

  useEffect(() => {
    tabulatorInstance.current = new Tabulator(tableRef.current, {
      data: customers,
      layout: "fitColumns",
      reactiveData: true,
      columns: [
        { title: "Customer ID", field: "customerId" },
        { title: "Full Name", field: "name" },
        { title: "Phone", field: "contact" },
        { title: "Email", field: "email" },
        { title: "Product", field: "product" },
        { title: "Date", field: "date" },
        { title: "Amount Paid", field: "price" }
      ],
    });

    return () => {
      tabulatorInstance.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/customers");
        const data = await res.json();
        setCustomers(data);
        tabulatorInstance.current?.setData(data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = async () => {
    const payload = {
  ...newCustomer,
  date: newCustomer.date
    ? newCustomer.date
    : new Date().toISOString().split("T")[0], // <-- This keeps only YYYY-MM-DD
};

    try {
      const res = await fetch("http://localhost:3001/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const added = await res.json();
      setCustomers(prev => [...prev, added]);
      tabulatorInstance.current?.addRow(added);
      setOpen(false);
      setNewCustomer({ name: "", customerId: "", contact: "", email: "", product: "", price: "", date: "", customerType: "" });
    } catch (err) {
      console.error("Error adding customer:", err);
    }
  };

  const handleFilter = () => {
    const filterValue = prompt("Enter product name to filter:");
    if (filterValue && tableRef.current?.tabulator) {
      tableRef.current.tabulator.setFilter("product", "like", filterValue);
    }
  };

  return (
    <div className="supplier-container">
      <Sidebar />
      <div className="supplier-main">
        <Header />
        <div className="supplier-content">
          <div className="supplier-header">
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Customers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your Customers efficiently
              </Typography>
            </Box>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="contained" onClick={() => setOpen(true)}>Add Customer</Button>
              <Button variant="outlined" onClick={handleFilter}>Filters</Button>
              <Button variant="outlined" onClick={() => tableRef.current?.tabulator.download("csv", "customers.csv")}>Download all</Button>
            </div>
          </div>
          <div ref={tableRef} className="supplier-table" />
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: "24px" }}>
          New Customer
        </DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", maxWidth: "500px", margin: "0 auto" }}>
            {/* Avatar */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{
                border: "2px dashed #bbb", borderRadius: "50%", width: 80, height: 80,
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: "#f5f5f5", margin: "0 auto",
              }}>
                <span style={{ fontSize: 32, color: "#777" }}>👤</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
                Drag image here <br />
                or <span style={{ color: "#1976d2", fontWeight: 500, cursor: "pointer" }}>Browse image</span>
              </p>
            </div>

            <Grid container spacing={2} justifyContent="center">
              {[
                ["Customer Name", "name"],
                ["Customer ID", "customerId"],
                ["Mobile Number", "contact"],
                ["Products Bought", "product"],
                ["Email ID", "email"],
                ["Buying Price", "price"],
              ].map(([label, name], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: "block" }}>
                    {label}
                  </label>
                  <input
                    name={name}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={newCustomer[name]}
                    onChange={handleInputChange}
                    style={{
                      width: "100%", padding: "12px", fontSize: "15px",
                      borderRadius: "10px", border: "1px solid #ccc",
                      backgroundColor: "#fff", outline: "none"
                    }}
                  />
                </Grid>

              ))}
              <Grid item xs={12} sm={6}>
                <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: "block" }}>
                  Bought Date
                </label>
                <Box sx={{ width: "185px" }}>
                <TextField
                  name="date"
                  type="date"
                  value={newCustomer.date}
                  onChange={handleInputChange}
                  fullWidth
                  sx={{
                    "& input": {
                      padding: "12px",
                      fontSize: "15px",
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <label style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: "block" }}>
                  Customer Type
                </label>
                <Box sx={{ width: "185px" }}>
                  <select
                    name="customerType"
                    value={newCustomer.customerType}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "15px",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      backgroundColor: "#fff",
                      outline: "none"
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="Retail">Retail</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="B2B">B2B</option>

                  </select>
                </Box>

              </Grid>
            </Grid>


            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 30 }}>
              <Button variant="outlined" onClick={() => setOpen(false)} sx={{ borderRadius: "10px", px: 4 }}>
                DISCARD
              </Button>
              <Button variant="contained" onClick={handleAddCustomer} sx={{ borderRadius: "10px", px: 4 }}>
                ADD CUSTOMER
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customer;
