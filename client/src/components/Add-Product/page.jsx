import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Typography,
    Box,
} from '@mui/material';
import { useEffect, useState } from "react";
import axios from "axios";

const AddProductDialog = ({ open, onClose, onSuccess }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [categoriesData, setCategoriesData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const [form, setForm] = useState({
        name: "",
        productId: "",
        buyingPrice: "",
        sellingPrice: "",
        quantity: "",
        unit: "",
        threshold: "",
        batchId: "",
        expiryDate: "",
        supplier: ""
    });

        const handleAddProduct = async () => {
            try {
                const payload = {
                    ...form,
                    categoryId: selectedCategory,
                    subcategoryId: selectedSubCategory,
                };

                await axios.post("http://localhost:3001/add-product", payload);

                if (onSuccess) {
                    onSuccess();
                }

                onClose();
            } catch (error) {
                console.error("Error adding product:", error);
                alert("Failed to add product.");
            }
        };

        const handleImageUpload = (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImagePreview(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        };

        useEffect(() => {
            const fetchCategories = async () => {
                try {
                    const res = await axios.get("http://localhost:3001/api/categories");
                    setCategoriesData(res.data);
                } catch (err) {
                    console.error("Failed to fetch categories", err);
                }
            };

            fetchCategories();
        }, []);



        return (
            <Dialog open={open} onClose={onClose} fullWidth PaperProps={{
                sx: {
                    width: '500px',
                    borderRadius: 2,
                },
            }}
            >
                <DialogTitle>New Product</DialogTitle>
                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    px: 3, // padding left-right
                    pt: 2,
                    pb: 0,
                }}>
                    <Box
                        sx={{
                            width: 160,
                            height: 120,
                            border: "2px dashed #ccc",
                            borderRadius: 2,
                            p: 2,
                            textAlign: "center",
                            mx: "auto",
                            cursor: "pointer",
                            backgroundColor: "#f9f9f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                        onClick={() => document.getElementById("imageUploadInput").click()}
                    >
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Uploaded Preview"
                                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                            />
                        ) : (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    Drag image here
                                </Typography>
                                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                    or Browse image
                                </Typography>
                            </>
                        )}
                        <input
                            id="imageUploadInput"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </Box>
                </DialogContent >

                <DialogContent>
                    <Box sx={{ width: "100%" }}>
                        <Grid container spacing={2}>
                            {/* First row */}
                            <Grid item xs={6}>
                                <TextField fullWidth sx={{ minWidth: 215 }} label="Product Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth sx={{ minWidth: 215 }} label="Product ID"
                                    value={form.productId}
                                    onChange={(e) => setForm({ ...form, productId: e.target.value })} />
                            </Grid>

                            {/* Second row */}
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Category"
                                    sx={{ minWidth: 215 }}
                                    value={selectedCategory || ""}
                                    onChange={(e) => {
                                        const catId = parseInt(e.target.value);
                                        setSelectedCategory(catId);
                                        setSelectedSubCategory(""); // reset subcategory on category change
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Category
                                    </MenuItem>
                                    {categoriesData.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Subcategory"
                                    sx={{ minWidth: 215 }}
                                    value={selectedSubCategory || ""}
                                    onChange={(e) => setSelectedSubCategory(parseInt(e.target.value))}
                                    disabled={!selectedCategory}
                                >
                                    <MenuItem value="" disabled>
                                        Select Subcategory
                                    </MenuItem>
                                    {(categoriesData.find((c) => c.id === selectedCategory)?.subcategories || []).map((sub) => (
                                        <MenuItem key={sub.id} value={sub.id}>
                                            {sub.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                            </Grid>

                            {/* Third row */}
                            <Grid item xs={6}>
                                <TextField fullWidth sx={{ minWidth: 215 }} label="Buying Price" type="number"
                                    value={form.buyingPrice}
                                    onChange={(e) => setForm({ ...form, buyingPrice: e.target.value })} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth sx={{ minWidth: 215 }} label="Selling Price" type="number"
                                    value={form.sellingPrice}
                                    onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
                            </Grid>

                            {/* Fourth row */}
                            <Grid item xs={6}>
                                <TextField fullWidth sx={{ minWidth: 215 }} label="Quantity" type="number"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    fullWidth
                                    sx={{ minWidth: 215 }}
                                    label="Select UOM"
                                    value={form.unit}
                                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
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

                            {/* Fifth row */}
                            <Grid item xs={6}>
                                <TextField fullWidth sx={{ minWidth: 215 }} label="Threshold Value" type="number"
                                    value={form.threshold}
                                    onChange={(e) => setForm({ ...form, threshold: e.target.value })} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth sx={{ minWidth: 215 }} label="Batch ID"
                                    value={form.batchId}
                                    onChange={(e) => setForm({ ...form, batchId: e.target.value })} />
                            </Grid>

                            {/* Sixth row */}
                            <Grid item xs={6}>
                                <TextField fullWidth label="Expiry Date" sx={{ minWidth: 215 }} type="date" InputLabelProps={{ shrink: true }}
                                    value={form.expiryDate}
                                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField select fullWidth label="Supplier" sx={{ minWidth: 215 }}
                                    value={form.supplier}
                                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
                                    <MenuItem value="Supplier A">Supplier A</MenuItem>
                                    <MenuItem value="Supplier B">Supplier B</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">Discard</Button>
                    <Button variant="contained" color="primary" onClick={handleAddProduct}>Add Product</Button>
                </DialogActions>
            </Dialog>
        );
    };

    export default AddProductDialog;
