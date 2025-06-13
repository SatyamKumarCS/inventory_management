// ItemMaster.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import CategoriesTable from "../../components/Categories-Table/page";
import axios from "../../api/axiosInstance";;
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import './style.css';


const ItemMaster = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      console.log("Fetched full category data:", JSON.stringify(res.data, null, 2)); // <--- ADD THIS
      setCategories(res.data);
    } catch (err) {
      console.log("Fetch error:", err)
      setSnackbar({
        open: true,
        message: "Failed to fetch categories",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      await axios.post("/api/categories", { name: newCategory });
      setSnackbar({ open: true, message: "Category added!", severity: "success" });
      fetchCategories();
      setShowAddCategory(false);
      setNewCategory("");
    } catch (err) {
      console.log("Add Category Error:", err)
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add category",
        severity: "error",
      });
    }
  };

  const handleAddSubCategory = async () => {
    try {
      await axios.post("/api/subcategories", {
        name: newSubCategory,
        categoryId: selectedCategory,
      });

      setSnackbar({
        open: true,
        message: "Subcategory added!",
        severity: "success",
      });

      fetchCategories(); 
      setShowSubCategory(false);
      setNewSubCategory("");
      setSelectedCategory("");
    } catch (err) {
      console.log("Add SubCategory Error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add subcategory",
        severity: "error",
      });
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      setSnackbar({ open: true, message: "Category deleted successfully", severity: "success" });
      fetchCategories();
    } catch (err) {
      console.error("Add Category Error:", err);
      setSnackbar({ open: true, message: "Failed to delete category", severity: "error" });
    }
  };

  return (
    <div className="ItemMaster-container">
      <Sidebar />
      <div className="ItemMaster-main">
        <Header />
        <div className="ItemMaster-content">
          <div className="ItemMaster-header-row">
            <h1>Item Master</h1>
            <div className="ItemMaster-buttons">
              <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setShowAddCategory(true)}>
                Add Category
              </Button>
              <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setShowSubCategory(true)}>
                Add Sub Category
              </Button>
              <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => navigate("/AddItem")}>Add Item</Button>
            </div>
          </div>

          <CategoriesTable
            categories={categories}
            onEdit={(cat) => console.log("Edit", cat)}
            onDelete={handleDelete}
          />

          {/* Add Category Dialog */}
          <Dialog open={showAddCategory} onClose={() => setShowAddCategory(false)} fullWidth>
            <DialogTitle>Add Category</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Category Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAddCategory(false)} color="secondary">Cancel</Button>
              <Button onClick={handleAddCategory} variant="contained">Submit</Button>
            </DialogActions>
          </Dialog>

          {/* Add Subcategory Dialog */}
          <Dialog open={showSubCategory} onClose={() => setShowSubCategory(false)} fullWidth>
            <DialogTitle>Add Sub Category</DialogTitle>
            <DialogContent>
              <TextField
                select
                label="Select Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                fullWidth
                margin="dense"
                variant="outlined"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                margin="dense"
                label="Sub Category Name"
                type="text"
                fullWidth
                variant="outlined"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSubCategory(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleAddSubCategory} variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
            >
              {snackbar.message}
            </MuiAlert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default ItemMaster;
