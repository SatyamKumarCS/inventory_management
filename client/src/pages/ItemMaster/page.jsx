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
  Typography,
} from "@mui/material";
import './style.css';
import ItemTable from "../../components/Add-item/page";


const ItemMaster = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categoryBeingEdited, setCategoryBeingEdited] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [editedSubcategories, setEditedSubcategories] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showItems, setShowItems] = useState(false);




  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      // console.log("Fetched full category data:", JSON.stringify(res.data, null, 2)); // <--- ADD THIS
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

  const handleEditCategory = (category) => {
    setCategoryBeingEdited(category);
    setEditedCategoryName(category.name);
    setEditedSubcategories(category.subcategories || []);
    setEditDialogOpen(true);
  };


  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`/api/categories/${id}`);
  //     setSnackbar({ open: true, message: "Category deleted successfully", severity: "success" });
  //     fetchCategories();
  //   } catch (err) {
  //     console.error("Add Category Error:", err);
  //     setSnackbar({ open: true, message: "Failed to delete category", severity: "error" });
  //   }
  // };

  const handleUpdateCategory = async () => {
    try {

      await axios.put(`/api/categories/${categoryBeingEdited.id}`, {
        name: editedCategoryName,
      });



      for (const sub of editedSubcategories) {
        if (sub.id) {

          await axios.put(`/api/subcategories/${sub.id}`, { name: sub.name });
        } else if (sub.name.trim()) {

          await axios.post(`/api/subcategories`, {
            name: sub.name,
            categoryId: categoryBeingEdited.id,
          });
        }
      }

      setSnackbar({ open: true, message: "Category updated!", severity: "success" });
      fetchCategories();
      setEditDialogOpen(false);
      setCategoryBeingEdited(null);
      setEditedSubcategories([]);
    } catch (err) {
      console.error("Update Error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update category",
        severity: "error",
      });
    }
  };

  const handleDeleteSubCategory = async (index) => {
    const subToDelete = editedSubcategories[index];


    if (subToDelete.id) {
      try {
        await axios.delete(`/api/subcategories/${subToDelete.id}`);
        console.log("Subcategory deleted from DB");
      } catch (error) {
        console.error("Error deleting subcategory from DB:", error);
        return;
      }
    }

    const updated = editedSubcategories.filter((_, i) => i !== index);
    setEditedSubcategories(updated);
  };


  const confirmDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete?.id) {
      console.error("No category selected for deletion");
      return;
    }

    try {
      await axios.delete(`/api/categories/${categoryToDelete.id}`);
      setSnackbar({ open: true, message: "Category deleted successfully", severity: "success" });
      fetchCategories();
    } catch (err) {
      console.error("Delete Category Error:", err);
      setSnackbar({ open: true, message: "Failed to delete category", severity: "error" });
    } finally {
      setConfirmDeleteOpen(false);
      setCategoryToDelete(null);
    }
  };




  return (
    <div className="ItemMaster-container">
      <Sidebar />
      <div className="ItemMaster-main">
        <Header />
        <div className="ItemMaster-content">
          <div className="ItemMaster-header-row">
            <Typography variant="h4" component="h1" fontWeight="Bold" gutterBottom>
              Item Master
            </Typography>
            <div className="ItemMaster-buttons">
              <Button variant="contained" onClick={() => setShowItems(!showItems)}>
                {showItems ? 'View Categories' : 'View Items'}
              </Button>
              <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setShowAddCategory(true)}>
                Add Category
              </Button>
              <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setShowSubCategory(true)}>
                Add Sub Category
              </Button>
              <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={() => navigate("/ItemMaster/additem")}>Add Item</Button>
            </div>
          </div>

          {showItems ? (
            <ItemTable />
          ) : (
            <CategoriesTable
              categories={categories}
              onEdit={handleEditCategory}
              onDelete={(category) => confirmDeleteCategory(category)}
            />
          )}



          {/* Category Dialog */}
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

          {/*  Subcategory Dialog */}
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
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Category Name"
                type="text"
                fullWidth
                variant="outlined"
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
              />

              <h4 style={{ marginTop: '20px' }}>Subcategories</h4>
              {editedSubcategories.map((sub, index) => (
                <div
                  key={sub.id || index}
                  style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={sub.name}
                    onChange={(e) => {
                      const updated = [...editedSubcategories];
                      updated[index].name = e.target.value;
                      setEditedSubcategories(updated);
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={async () => handleDeleteSubCategory(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}

              <Button
                variant="outlined"
                onClick={() => setEditedSubcategories([...editedSubcategories, { name: "" }])}
              >
                Add Subcategory
              </Button>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory} variant="contained">
                Update
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
          >
            <DialogTitle>Delete Category</DialogTitle>
            <DialogContent>
              <Typography variant="body1" color="textSecondary" sx={{ color: "#555", mb: 1 }}>
                Are you sure you want to delete <strong>{categoryToDelete?.name}</strong> and all its subcategories?
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ color: "#777" }}>
                This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export default ItemMaster;
