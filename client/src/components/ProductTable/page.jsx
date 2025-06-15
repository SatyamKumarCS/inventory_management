import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, IconButton, Box } from "@mui/material";
import { SquarePen, Trash2, Eye } from "lucide-react";


export default function ProductTable({ products }) {

  // if (!Array.isArray(products)) {
  //   return (
  //     <Typography variant="body2" sx={{ p: 3 }}>
  //       No product data available.
  //     </Typography>
  //   );
  // }

  const handleEdit = (product) => {
    console.log("Edit", product);
  };

  const handleDelete = (product) => {
    console.log("Delete", product);
  };

  const handleView = (product) => {
    console.log("View", product);
  };

  const getAvailabilityStatus = (quantity, threshold) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity <= threshold) return "Low Stock";
    return "In Stock";
  };


  return (
    <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center"><strong>Products</strong></TableCell>
            <TableCell align="center"><strong>Buying Price</strong></TableCell>
            <TableCell align="center"><strong>Quantity</strong></TableCell>
            <TableCell align="center"><strong>Threshold Value</strong></TableCell>
            <TableCell align="center"><strong>Expiry Date</strong></TableCell>
            <TableCell align="center"><strong>Availability</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!Array.isArray(products) || products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                  No products found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, index) => {
              return (
                <TableRow key={index}>
                  <TableCell align="center">{product.name}</TableCell>
                  <TableCell align="center">{product.buyingPrice}</TableCell>
                  <TableCell align="center">{product.quantity} Unit</TableCell>
                  <TableCell align="center">{product.threshold} Unit</TableCell>
                  <TableCell align="center">
                    {new Date(product.expiryDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getAvailabilityStatus(product.quantity, product.threshold)}
                      color={
                        getAvailabilityStatus(product.quantity, product.threshold) === "In Stock"
                          ? "success"
                          : getAvailabilityStatus(product.quantity, product.threshold) === "Low Stock"
                            ? "warning"
                            : "error"
                      }
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(product)}
                      >
                        <Eye size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleEdit(product)}
                      >
                        <SquarePen size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>

      </Table>
    </TableContainer >
  );
}
