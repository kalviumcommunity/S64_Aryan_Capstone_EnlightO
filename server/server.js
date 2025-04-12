require("dotenv").config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 5005;

// Middleware
app.use(cors());
app.use(express.json()); // Allows you to parse JSON in request body

// Routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('Website is running...');
});

// Error handler (should come last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});