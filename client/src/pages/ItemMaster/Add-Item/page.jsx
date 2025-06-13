import Sidebar from "./../../../components/sidebar/page";
import Header from "./../../../components/header/page";
import './style.css';
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
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <Typography variant="h5" gutterBottom>
            Item Master
          </Typography>

          {/* Item Info Section */}
          <Paper elevation={1} style={{ padding: "24px", marginBottom: "24px" }}>
            <Typography variant="h6" gutterBottom>
              Item Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Item Name" fullWidth sx={{ minWidth: 250 }}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Item Code" fullWidth  sx={{ minWidth: 250 }}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Category" value="Electronics" fullWidth  sx={{ minWidth: 250 }}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Sub Category" value="Laptops" fullWidth  sx={{ minWidth: 250 }}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Specification" fullWidth  sx={{ minWidth: 250 }}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Brand" fullWidth sx={{ minWidth: 250 }}/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Invoice Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expiry Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
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
                  label="Unit of Measurement"
                  select
                  fullWidth
                  defaultValue="Select UOM"
                  sx={{ minWidth: 250 }}
                >
                  <MenuItem value="pcs">Pieces</MenuItem>
                  <MenuItem value="kg">Kilograms</MenuItem>
                  <MenuItem value="ltr">Litres</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          {/* Stock Details Section */}
          <Paper elevation={1} style={{ padding: "24px", marginBottom: "24px" }}>
            <Typography variant="h6" gutterBottom>
              Stock Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Opening Stock" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="As on Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Minimum Stock Level"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>

          <Button variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;
