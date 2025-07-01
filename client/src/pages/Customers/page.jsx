import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
  Typography,
  IconButton,
  TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import './style.css';

const Customer = () => {
  const tableRef = useRef(null);
  const tabulatorInstance = useRef(null);
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
        {
          title: "Full Name",
          field: "name",
          formatter: (cell) => `<span style="color:#1976d2;cursor:pointer;">${cell.getValue()}</span>`,
          cellClick: (e, cell) => {
            setSelectedCustomer(cell.getRow().getData());
          }
        },
        { title: "Phone", field: "contact" },
        { title: "Email", field: "email" },
        { title: "Product", field: "product" },
        {
          title: "Date",
          field: "date",
          formatter: (cell) => {
            const date = cell.getValue();
            return date ? new Date(date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }) : "N/A";
          }},
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
      date: newCustomer.date ? newCustomer.date : new Date().toISOString().split("T")[0],
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

      {/* Add Customer Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: "24px" }}>
          New Customer
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} justifyContent="center">
            {["name", "customerId", "contact", "product", "email", "price"].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={newCustomer[field]}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={newCustomer.date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Customer Type"
                name="customerType"
                value={newCustomer.customerType}
                onChange={handleInputChange}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="">Select Type</option>
                <option value="Retail">Retail</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="B2B">B2B</option>
              </TextField>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" mt={2} gap={2}>
            <Button variant="outlined" onClick={() => setOpen(false)}>Discard</Button>
            <Button variant="contained" onClick={handleAddCustomer}>Add Customer</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={Boolean(selectedCustomer)} onClose={() => setSelectedCustomer(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 4, py: 2 }}>
          <Typography variant="h6">{selectedCustomer?.name}</Typography>
          <IconButton onClick={() => setSelectedCustomer(null)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 6, py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box display="grid" gridTemplateColumns="150px 1fr" rowGap={2} columnGap={2}>
                <Typography fontWeight={500} color="text.secondary">Customer ID:</Typography>
                <Typography>{selectedCustomer?.customerId || "N/A"}</Typography>

                <Typography fontWeight={500} color="text.secondary">Phone:</Typography>
                <Typography>{selectedCustomer?.contact || "N/A"}</Typography>

                <Typography fontWeight={500} color="text.secondary">Email:</Typography>
                <Typography>{selectedCustomer?.email || "N/A"}</Typography>

                <Typography fontWeight={500} color="text.secondary">Product:</Typography>
                <Typography>{selectedCustomer?.product || "N/A"}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="grid" gridTemplateColumns="150px 1fr" rowGap={2} columnGap={2}>
                <Typography fontWeight={500} color="text.secondary">Amount Paid:</Typography>
                <Typography>{selectedCustomer?.price || "N/A"}</Typography>

                <Typography fontWeight={500} color="text.secondary">Date:</Typography>
                <Typography>
                  {selectedCustomer?.date ? new Date(selectedCustomer.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }) : "N/A"}
                </Typography>

                <Typography fontWeight={500} color="text.secondary">Customer Type:</Typography>
                <Typography>{selectedCustomer?.customerType || "N/A"}</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customer;
