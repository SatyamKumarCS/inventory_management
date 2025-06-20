const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { PrismaClient } = require('./generated/prisma');
const UserModel = require('./model/user')
const bodyParser = require('body-parser')

const app = express()
const prisma = new PrismaClient()
app.use(express.json())
app.use(cors())
require('dotenv').config()
app.use(bodyParser.json())


prisma.$connect()
    .then(() => console.log("Connected to PostgreSQL via Prisma"))
    .catch(err => console.error("PostgreSQL Prisma error:", err));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." })
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password." })
        }
        res.status(200).json({ message: "Login successful", user })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please log in." })
        }

        const newUser = await UserModel.create({ name, email, password });
        res.status(201).json({ message: "User registered successfully", user: newUser })
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message })
    }
})


// Add a new category
app.post('/api/categories', async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        const category = await prisma.category.create({
            data: { name },
        });
        res.status(201).json(category);
    } catch (error) {
        console.error("Add Category Error:", error);
        res.status(500).json({ message: "Error adding category" });
    }
});


// Add SubCategory
app.post('/api/subcategories', async (req, res) => {
    const { categoryId, name } = req.body;

    if (!categoryId || !name || name.trim() === "") {
        return res.status(400).json({ message: "Category ID and Subcategory name are required" });
    }

    try {
        const subcategory = await prisma.subCategory.create({
            data: {
                name,
                category: {
                    connect: { id: parseInt(categoryId) }
                }
            }
        });
        res.status(201).json({ message: "Subcategory added", subcategory });
    } catch (err) {
        console.error("Error adding subcategory:", err);
        res.status(500).json({ message: "Failed to add subcategory" });
    }
});

// Get All Categories with Subcategories
app.get('/api/categories', async (req, res) => {
    try {
        // console.log("Categories API HIT");
        const categories = await prisma.category.findMany({
            include: {
                subcategories: true,
            },
        });

        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Category name is required" });
    }

    try {
        const updated = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name },
        });
        res.status(200).json({ message: "Category updated", category: updated });
    } catch (err) {
        console.error("Error updating category:", err);
        res.status(500).json({ message: "Failed to update category" });
    }
});

app.put('/api/subcategories/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedSubcategory = await prisma.subCategory.update({
            where: { id: parseInt(id) },
            data: { name },
        });

        res.json({ message: "Subcategory updated", subcategory: updatedSubcategory });
    } catch (err) {
        console.error("Subcategory update error:", err);
        res.status(500).json({ message: "Failed to update subcategory" });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.subCategory.deleteMany({
            where: { categoryId: id },
        });

        await prisma.category.delete({
            where: { id },
        });

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(404).json({ message: "Category not found or already deleted" });
    }
});


app.post("/add-product", async (req, res) => {
    const {
      name,
      productId,
      categoryId,
      subcategoryId,
      buyingPrice,
      sellingPrice,
      quantity,
      unit,
      threshold,
      batchId,
      expiryDate: rawExpiryDate,
      supplier,
    } = req.body;
  
    // ✅ Validate expiry date
    let expiryDate = rawExpiryDate ? new Date(rawExpiryDate) : null;
    if (expiryDate && isNaN(expiryDate.getTime())) {
      return res.status(400).json({ error: "Invalid expiry date format" });
    }
  
    try {
      const product = await prisma.product.create({
        data: {
          name,
          productId,
          categoryId: parseInt(categoryId),
          subcategoryId: parseInt(subcategoryId),
          buyingPrice: parseFloat(buyingPrice),
          sellingPrice: parseFloat(sellingPrice),
          quantity: parseInt(quantity),
          unit,
          threshold: parseInt(threshold),
          batchId,
          expiryDate, 
          supplier,
        },
      });
  
      res.status(201).json(product);
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Error adding product" });
    }
  });
  app.get('/api/products', async (req, res) => {
    try {
      const products = await prisma.product.findMany();
      res.json(products);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: err.message });
    }
  });


//   app.get("/api/stats", async (req, res) => {
//     try {
//       // Total categories
//       const totalCategories = await prisma.category.count();
  
//       // Total products
//       const totalProducts = await prisma.product.count();
  
//       // Low stock: quantity > 0 but <= threshold
//       const lowStock = await prisma.product.count({
//         where: {
//           AND: [
//             { quantity: { gt: 0 } },
//             { quantity: { lte: prisma.product.fields.threshold } },
//           ],
//         },
//       });
  
//       // Alternative logic (if threshold field not usable through prisma.fields)
//       const allProducts = await prisma.product.findMany({
//         select: {
//           quantity: true,
//           threshold: true,
//         },
//       });
  
//       const lowStockCount = allProducts.filter(
//         (p) => p.quantity > 0 && p.quantity <= p.threshold
//       ).length;
  
//       const outOfStock = allProducts.filter((p) => p.quantity === 0).length;
  
//       res.json({
//         totalCategories,
//         totalProducts,
//         lowStock: lowStockCount,
//         outOfStock,
//       });
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//       res.status(500).json({ message: "Error fetching stats", error: error.message });
//     }
//   });



// POST /api/items — Save Item to DB
app.post('/api/items', async (req, res) => {
  try {
    const {
      name, productId, categoryId, subcategoryId,
      specification, brand, invoiceDate, expiryDate,
      unitOfMeasurement, openingStock, asOnDate,
      minStockLevel, unitPrice, gstRate
    } = req.body;

    const newItem = await prisma.item.create({
      data: {
        name,
        productId,
        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
        specification,
        brand,
        invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        unitOfMeasurement,
        openingStock: Number(openingStock),
        asOnDate: asOnDate ? new Date(asOnDate) : null,
        minStockLevel: Number(minStockLevel),
        unitPrice: Number(unitPrice),
        gstRate: Number(gstRate),
      },
      include: {
        category: true,      // 👈 fetch related Category object
        subcategory: true    // 👈 fetch related SubCategory object
      },
    });

    res.json({ success: true, item: newItem });
  } catch (error) {
    console.error("❌ Error saving item:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        Category: true,
        SubCategory: true,
      }
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("GET /api/items error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});
  


app.listen(3001, () =>
    console.log('server is running')
)