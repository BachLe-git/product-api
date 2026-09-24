require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Product RESTful API is running'
    });
});

app.get('/health', (req, res) => {
    if (mongoose.connection.readyState === 1) {
        return res.status(200).json({
            status: 'UP',
            mongodb: 'CONNECTED'
        });
    }

    res.status(503).json({
        status: 'DOWN',
        mongodb: 'DISCONNECTED'
    });
});

app.use('/api/products', productRoutes);

async function startServer() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

startServer();