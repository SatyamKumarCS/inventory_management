import React, { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  IconButton,
  Box,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EditIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
const DeleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 6l1 14h12l1-14"/></svg>`;

export default function ProductTabulatorTable({ products }) {
  const tableRef = useRef(null);
  const tableInstance = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (tableRef.current && products.length > 0) {
      tableInstance.current = new Tabulator(tableRef.current, {
        data: products,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 10,
        columns: [
          {
            title: "Product",
            field: "name",
            sorter: "string",
            headerMenu: true,
            formatter: (cell) => `<span class="product-name" style="color:#1976d2;cursor:pointer;">${cell.getValue()}</span>`,
            cellClick: function (e, cell) {
              handleOpen(cell.getRow().getData());
            }
          },
          { title: "Buying Price", field: "buyingPrice", sorter: "number", headerMenu: true },
          { title: "Quantity", field: "quantity", sorter: "number", headerMenu: true },
          { title: "Threshold", field: "threshold", sorter: "number", headerMenu: true },
          {
            title: "Expiry Date",
            field: "expiryDate",
            sorter: "date",
            headerMenu: true,
            formatter: (cell) =>
              new Date(cell.getValue()).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })
          },
          {
            title: "Availability",
            field: "availability",
            formatter: (cell) => {
              const { quantity, threshold } = cell.getRow().getData();
              if (quantity === 0) return "<span style='color:red;font-weight:600;'>Out of Stock</span>";
              if (quantity <= threshold) return "<span style='color:orange;font-weight:600;'>Low Stock</span>";
              return "<span style='color:green;font-weight:600;'>In Stock</span>";
            }
          },
          {
            title: "Actions",
            hozAlign: "center",
            headerSort: false,
            formatter: () => `
              <div style="display:flex; gap:6px; justify-content:center;">
                <button class="btn-view" title="View" style="border:none;background:none;cursor:pointer;">${EyeIcon}</button>
                <button class="btn-edit" title="Edit" style="border:none;background:none;cursor:pointer;">${EditIcon}</button>
                <button class="btn-delete" title="Delete" style="border:none;background:none;cursor:pointer;">${DeleteIcon}</button>
              </div>
            `,
            cellClick: (e, cell) => {
              const product = cell.getRow().getData();
              if (e.target.closest(".btn-view")) {
                handleOpen(product);
              } else if (e.target.closest(".btn-edit")) {
                console.log("Edit", product);
              } else if (e.target.closest(".btn-delete")) {
                console.log("Delete", product);
              }
            }
          }
        ]
      });

      return () => {
        tableInstance.current?.destroy();
      };
    }
  }, [products]);
  
  return (
    <>
      <div ref={tableRef}></div>

      {/* Product Detail Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 4, py: 2 }}>
          <Typography variant="h6" component="div">
            {selectedProduct?.name}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "grey.600" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 6, py: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box display="grid" gridTemplateColumns="150px 1fr" rowGap={2} columnGap={2}>
                <Typography fontWeight={500} color="text.secondary">Batch ID:</Typography>
                <Typography>{selectedProduct?.batchId}</Typography>

                <Typography fontWeight={500} color="text.secondary">Category:</Typography>
                <Typography>{selectedProduct?.category?.name || "N/A"}</Typography>

                <Typography fontWeight={500} color="text.secondary">Subcategory:</Typography>
                <Typography>{selectedProduct?.subcategory?.name || "N/A"}</Typography>

                <Typography fontWeight={500} color="text.secondary">Buying Price:</Typography>
                <Typography>₹ {selectedProduct?.buyingPrice}</Typography>

                <Typography fontWeight={500} color="text.secondary">Selling Price:</Typography>
                <Typography>₹ {selectedProduct?.sellingPrice}</Typography>

                <Typography fontWeight={500} color="text.secondary">Unit:</Typography>
                <Typography>{selectedProduct?.unit}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="grid" gridTemplateColumns="150px 1fr" rowGap={2} columnGap={2}>
                <Typography fontWeight={500} color="text.secondary">Supplier:</Typography>
                <Typography>{selectedProduct?.supplier}</Typography>

                <Typography fontWeight={500} color="text.secondary">Quantity:</Typography>
                <Typography>{selectedProduct?.quantity}</Typography>

                <Typography fontWeight={500} color="text.secondary">Threshold:</Typography>
                <Typography>{selectedProduct?.threshold}</Typography>

                <Typography fontWeight={500} color="text.secondary">Expiry Date:</Typography>
                <Typography>
                  {selectedProduct?.expiryDate ? new Date(selectedProduct.expiryDate).toLocaleDateString("en-IN") : "N/A"}
                </Typography>

                <Typography fontWeight={500} color="text.secondary">Created:</Typography>
                <Typography>
                  {selectedProduct?.createdAt ? new Date(selectedProduct.createdAt).toLocaleString("en-IN") : "N/A"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>


      </Dialog>
    </>
  );
}
