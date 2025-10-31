// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Route imports
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const userAdminRoutes = require('./routes/userAdminRoutes');

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(cors()); // Enable CORS
app.use(cookieParser()); // Read token from cookies

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Web GUI Routes
app.use('/', require('./web/webRoutes'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/users', userAdminRoutes);

// Simple root route
app.get('/', (req, res) => {
    res.send('Backend Root API is running...');
});

// A simple test route
app.get('/api', (req, res) => {
  res.send('Backend API is running...');
});

// Basic error handling middleware (can be expanded)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);