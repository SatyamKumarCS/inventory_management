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
      const products = await prisma.product.findMany(({
        include: {
          category: true,
          subcategory: true,
        }
      }));
      res.json(products);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: err.message });
    }
  });


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
        Category: {
          connect: { id: Number(categoryId) }
        },
        SubCategory: {
          connect: { id: Number(subcategoryId) }
        },
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
        Category: true,
        SubCategory: true
      },
    });

    res.json({ success: true, item: newItem });
  } catch (error) {
    console.error("Error saving item:", error);
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
  
app.post("/api/suppliers", async (req, res) => {
  try {
    const {
      name,
      product,
      categoryId, 
      price,
      contact,
      email,
      date
    } = req.body;
    const parsedCategoryId = parseInt(categoryId);

    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ error: "Invalid categoryId" });
    }


    const supplier = await prisma.supplier.create({
      data: {
        name,
        product,
        categoryId: Number(categoryId),
        price,
        contact,
        email,
        date
      },
    });

    res.status(201).json(supplier);
  } catch (err) {
    console.error("Failed to add supplier:", err);
    res.status(500).json({ error: "Failed to add supplier" });
  }
});


app.get("/api/suppliers", async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        category: true,
      },
    });
    res.json(suppliers);
  } catch (err) {
    console.error("Prisma supplier fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch suppliers", details: err.message });
  }
});
app.post("/api/customers", async (req, res) => {
  const { name, customerId, contact, email, product, price, date, customerType } = req.body;

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        customerId,
        contact,
        email,
        product,
        price,
        date: new Date(date),
        customerType,
      },
    });
    res.json(newCustomer);
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

app.post('/api/orders', async (req, res) => {
  const {
    orderId,
    product,
    value,
    quantity,
    delivery,
    status,
    categoryId, 
  } = req.body;

  try {
    const newOrder = await prisma.order.create({
      data: {
        orderId,
        product,
        value: parseFloat(value),
        quantity,
        delivery: new Date(delivery),
        status,
        category: {
          connect: { id: categoryId },
        },
      },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: 'Invalid data', error });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});



app.listen(3001, () =>
    console.log('server is running')
)