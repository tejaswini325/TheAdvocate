const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 
const morgan = require('morgan'); 
require('dotenv').config(); 
 
const connectDB = require('./src/config/database'); 
const errorHandler = require('./src/middleware/errorMiddleware'); 
 
// Route imports 
const authRoutes = require('./src/routes/authRoutes'); 
const clientRoutes = require('./src/routes/clientRoutes'); 
const caseRoutes = require('./src/routes/caseRoutes'); 
const taskRoutes = require('./src/routes/taskRoutes'); 
const documentRoutes = require('./src/routes/documentRoutes'); 
const dashboardRoutes = require('./src/routes/dashboardRoutes'); 
const userRoutes = require('./src/routes/userRoutes');

const app = express(); 
 
// Connect to MongoDB 
connectDB(); 
 
// Middleware 
app.use(cors({ 
  credentials: true 
})); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev')); 
 
// Health check endpoint 
app.get('/health', (req, res) => { 
  res.status(200).json({ 
    status: 'success', 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  }); 
}); 
 
// API Routes 
app.use('/api/auth', authRoutes); 
app.use('/api/clients', clientRoutes); 
app.use('/api/cases', caseRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/documents', documentRoutes); 
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/users', userRoutes);
// Error handling middleware 
app.use(errorHandler); 
 
// 404 handler 
app.use('*', (req, res) => { 
  res.status(404).json({ 
    status: 'error', 
    message: 'Route not found' 
  }); 
}); 
 
 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { 
  console.log(`Server running on port ${PORT}`); 
}); 
