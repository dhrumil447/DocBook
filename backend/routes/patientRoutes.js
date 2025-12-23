const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get all patients
router.get('/', async (req, res) => {
  console.log('🔵 GET /api/patients');
  try {
    const { email } = req.query;
    
    if (email) {
      console.log('🔍 Searching for patient with email:', email);
      const [rows] = await db.query('SELECT id, username, email, phone, gender, age, created_at FROM patients WHERE email = ?', [email]);
      console.log('✅ Found patients:', rows.length);
      return res.json(rows);
    }
    
    const [rows] = await db.query('SELECT id, username, email, phone, gender, age, created_at FROM patients');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error in GET /api/patients:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create patient (Register)
router.post('/', async (req, res) => {
  console.log('🔵 POST /api/patients - Registration attempt');
  console.log('📦 Request body:', req.body);
  
  try {
    const { username, email, password, phone, gender, age } = req.body;
    
    // Validation
    if (!username || !email || !password || !phone) {
      console.log('❌ Validation failed - missing required fields');
      return res.status(400).json({ error: 'Username, email, password, and phone are required' });
    }

    // Check if email already exists
    const [existingPatient] = await db.query('SELECT id FROM patients WHERE email = ?', [email]);
    
    if (existingPatient.length > 0) {
      console.log('❌ Email already exists:', email);
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');
    
    console.log('💾 Inserting into database...');
    const [result] = await db.query(
      'INSERT INTO patients (username, email, password, phone, gender, age) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, gender, age]
    );

    console.log('✅ Patient created successfully - ID:', result.insertId);
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('❌ Error in POST /api/patients:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, phone, gender, age, created_at FROM patients WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const { username, email, phone, gender, age } = req.body;
    
    await db.query(
      'UPDATE patients SET username = ?, email = ?, phone = ?, gender = ?, age = ? WHERE id = ?',
      [username, email, phone, gender, age, req.params.id]
    );
    
    res.json({ success: true, message: 'Patient updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM patients WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
