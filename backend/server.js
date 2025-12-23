const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting DocBook Backend Server...');
console.log('📝 Environment:', {
  PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER
});

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:7777', 'http://localhost:7778', 'http://localhost:7779'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, req.body);
  next();
});

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');
const slotRoutes = require('./routes/slotRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

console.log('✅ All routes imported successfully');

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

console.log('✅ All routes registered:');
console.log('  - POST /api/patients (Register)');
console.log('  - GET /api/patients');
console.log('  - POST /api/auth/login');
console.log('  - GET /api/doctors');
console.log('  - POST /api/appointments');
console.log('  - GET /api/payments');
console.log('  - GET /api/dashboard/stats');

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'DocBook API Server is running!',
    endpoints: {
      patients: '/api/patients',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      reviews: '/api/reviews',
      contacts: '/api/contacts',
      slots: '/api/slots',
      auth: '/api/auth',
      payments: '/api/payments',
      dashboard: '/api/dashboard/stats'
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log('❌ 404 Not Found:', req.method, req.path);
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log(`🔍 Test endpoint: http://localhost:${PORT}/api/patients\n`);
});
