const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UserModel = require('./model/user')

const app = express()
app.use(express.json())
app.use(cors())
require('dotenv').config();

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

app.listen(3001, () =>
    console.log('server is running')
)