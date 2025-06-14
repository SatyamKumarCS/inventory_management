import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import "./style.css";

import { Grid, Typography, Box, Button, Paper } from "@mui/material";
import {
  Boxes,
  PackageCheck,
  TrendingDown,
  AlertTriangle,
  Plus,
} from "lucide-react";

const Inventory = () => {
  const stats = [
    {
      label: "Total Categories",
      value: 8,
      icon: <Boxes color="#3b82f6" />,
      sub: "Last 7 Days",
    },
    {
      label: "Total Products",
      value: 120,
      icon: <PackageCheck color="#10b981" />,
      sub: "Last 7 Days",
    },
    {
      label: "Low Stock",
      value: 5,
      icon: <TrendingDown color="#f59e0b" />,
      sub: "Last 7 Days",
    },
    {
      label: "Out Of Stock",
      value: 3,
      icon: <AlertTriangle color="#ef4444" />,
      sub: "Last 7 Days",
    },
  ];

  return (
    <div className="inventory-container">
      <Sidebar />
      <div className="inventory-main">
        <Header />

        <Box className="inventory-content">
          {/* Page Header */}
          <Box className="inventory-header">
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Overall Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your product inventory efficiently
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Plus />}
              className="add-product-btn"
            >
              Add Product
            </Button>
          </Box>

          {/* Stat Cards */}
          <Box display="flex" justifyContent="center">
            <Grid container spacing={3} className="stat-grid">
              {stats.map((stat, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={index}
                  display="flex"
                  justifyContent="center"
                >
                  <Paper className="stat-card" elevation={1}>
                    <Box className="stat-card-header">
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        {stat.label}
                      </Typography>
                      {stat.icon}
                    </Box>
                    <Box className="stat-card-body">
                    <Typography variant="h5" fontWeight={600}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" >
                      {stat.sub}
                    </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Inventory;
