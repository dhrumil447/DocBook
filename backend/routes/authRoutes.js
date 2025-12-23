const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Login
router.post('/login', async (req, res) => {
  console.log('🔵 POST /api/auth/login - Login attempt');
  console.log('📦 Request body:', req.body);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check in patients
    console.log('🔍 Checking patients table for:', email);
    const [patients] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
    
    if (patients.length > 0) {
      console.log('✅ Patient found, verifying password...');
      const patient = patients[0];
      const isMatch = await bcrypt.compare(password, patient.password);
      
      if (isMatch) {
        console.log('✅ Patient login successful - ID:', patient.id);
        return res.json({
          success: true,
          user: {
            id: patient.id,
            username: patient.username,
            email: patient.email,
            phone: patient.phone,
            gender: patient.gender,
            age: patient.age,
            isAdmin: patient.is_admin,
            isLoggedIn: true
          }
        });
      }
      console.log('❌ Patient password mismatch');
    } else {
      console.log('🔍 Patient not found, checking doctors table...');
    }

    // Check in doctors
    console.log('🔍 Checking doctors table for:', email);
    const [doctors] = await db.query('SELECT * FROM doctors WHERE email = ?', [email]);
    
    if (doctors.length > 0) {
      console.log('✅ Doctor found, verifying password...');
      const doctor = doctors[0];
      const isMatch = await bcrypt.compare(password, doctor.password);
      
      if (isMatch) {
        console.log('✅ Doctor login successful - ID:', doctor.id);
        return res.json({
          success: true,
          user: {
            id: doctor.id,
            username: doctor.username,
            email: doctor.email,
            phone: doctor.phone,
            specialization: doctor.specialization,
            isDoctor: true,
            isLoggedIn: true
          }
        });
      }
      console.log('❌ Doctor password mismatch');
    } else {
      console.log('❌ Email not found in any table');
    }

    res.status(401).json({ success: false, error: 'Invalid email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Register Patient
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone, gender, age } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO patients (username, email, password, phone, gender, age) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, gender, age]
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
