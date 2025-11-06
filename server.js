import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './db/connect.js';
import productRouter from './routes/productRoutes.js';
import authRouter from './routes/auth.js';


// Load environment variables
dotenv.config();
// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/products', productRouter); // for parsing application/json
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
