import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import { Button, Dialog, DialogTitle, DialogContent, TextField, Grid, Box,Typography} from "@mui/material";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import './style.css';

const Supplier = () => {
  const tableRef = useRef(null);
  const tabulatorInstance = useRef(null);
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([])
  const [categories, setCategories] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: "", product: "", categoryId: "", price: "", contact: "", email: ""
  });



  useEffect(() => {
    tabulatorInstance.current = new Tabulator(tableRef.current, {
      data: suppliers,
      layout: "fitColumns",
      reactiveData: true,
      columns: [
        { title: "Supplier Name", field: "name" },
        { title: "Category", field: "category.name" },
        { title: "Product", field: "product" },
        { title: "Buying Price", field: "price" },
        { title: "Contact Number", field: "contact" },
        { title: "Email", field: "email" },
      ],
    });

    return () => {
      tabulatorInstance.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/suppliers");
        const data = await res.json();
        setSuppliers(data); // Set state
        tabulatorInstance.current?.setData(data); // Set in Tabulator
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
      }
    };
  
    fetchSuppliers();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async () => {
    const payload = {
      name: newSupplier.name,
      product: newSupplier.product,
      categoryId: parseInt(newSupplier.categoryId),
      price: newSupplier.price,
      contact: newSupplier.contact,
      email: newSupplier.email,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch("http://localhost:3001/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const added = await response.json();

      // Update state
      setSuppliers(prev => [...prev, added]);

      // 👇 Add directly to Tabulator table
      tabulatorInstance.current?.addRow(added);

      setOpen(false);
      setNewSupplier({ name: "", product: "", category: "", price: "", contact: "", email: "" });
    } catch (err) {
      console.error("Error adding supplier:", err);
    }
  };

  const handleFilter = () => {
    const filterValue = prompt("Enter product name to filter (e.g. Dairy Milk):");
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
                Supplier
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your Suppliers efficiently
              </Typography>
            </Box>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="contained" onClick={() => setOpen(true)}>
                Add Supplier
              </Button>
              <Button variant="outlined" onClick={() => handleFilter()}>
                Filters
              </Button>
              <Button variant="outlined" onClick={() => tableRef.current?.tabulator.download("csv", "suppliers.csv")}>
                Download all
              </Button>

            </div>
          </div>
          <div ref={tableRef} className="supplier-table" />
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", fontSize: "24px" }}>
          New Supplier
        </DialogTitle>

        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",       // 👈 Center everything horizontally
              justifyContent: "center",
              maxWidth: "500px",
              margin: "0 auto",           // 👈 Center the whole block
            }}
          >
            {/* Image Upload */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div
                style={{
                  border: "2px dashed #bbb",
                  borderRadius: "50%",
                  width: 80,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  margin: "0 auto",
                }}
              >
                <span style={{ fontSize: 32, color: "#777" }}>👤</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
                Drag image here <br />
                or <span style={{ color: "#1976d2", fontWeight: 500, cursor: "pointer" }}>Browse image</span>
              </p>
            </div>

            {/* Form Fields (2-column grid) */}
            <Grid container spacing={2} justifyContent="center">
              {[
                ["Supplier Name", "name"],
                ["Product", "product"],
                ["Buying Price", "price"],
                ["Contact Number", "contact"],
                ["G-Mail ID", "email"]
              ].map(([label, name], index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: 4,
                      display: "block"
                    }}
                  >
                    {label}
                  </label>
                  <input
                    name={name}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={newSupplier[name]}
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
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <label
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    marginBottom: 4,
                    display: "block"
                  }}
                >
                  Category
                </label>
                <select
                  value={newSupplier.categoryId}
                  onChange={(e) =>
                    setNewSupplier({ ...newSupplier, categoryId: parseInt(e.target.value) || "" })
                  }
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
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginTop: 30,
              }}
            >
              <Button variant="outlined" onClick={() => setOpen(false)} sx={{ borderRadius: "10px", px: 4 }}>
                DISCARD
              </Button>
              <Button variant="contained" onClick={handleAddSupplier} sx={{ borderRadius: "10px", px: 4 }}>
                ADD SUPPLIER
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default Supplier;
