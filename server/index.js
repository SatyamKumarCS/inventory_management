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
        return res.status(400).json({ message: 'Category name is required' });
    }

    try {
        const newCategory = await prisma.category.create({
            data: { name },
        });

        res.status(201).json({ message: 'Category added', category: newCategory });
    } catch (err) {
        console.error('Error adding category:', err);
        if (err.code === 'P2002') {  
            res.status(409).json({ message: 'Category already exists' });
        } else {
            res.status(500).json({ message: 'Failed to add category' });
        }
    }
})

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


app.listen(3001, () =>
    console.log('server is running')
)