const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { email, city, specialization } = req.query;
    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params = [];
    
    if (email) {
      query += ' AND email = ?';
      params.push(email);
    }
    if (city) {
      query += ' AND city = ?';
      params.push(city);
    }
    if (specialization) {
      query += ' AND specialization = ?';
      params.push(specialization);
    }
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create doctor
router.post('/', async (req, res) => {
  console.log('🔵 POST /api/doctors - Doctor registration');
  console.log('📦 Request body:', req.body);
  
  try {
    const { username, email, password, phone, gender, age, specialization, qualification, experience, clinic_name, clinic_address, city, consultation_fee, available_days, available_time, profile_image, identity_proof, degree_proof, clinic_reg_proof } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if email already exists
    const [existingDoctor] = await db.query('SELECT id FROM doctors WHERE email = ?', [email]);
    
    if (existingDoctor.length > 0) {
      console.log('❌ Email already exists:', email);
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    console.log('💾 Inserting doctor into database...');
    const [result] = await db.query(
      `INSERT INTO doctors 
      (username, email, password, phone, gender, age, specialization, qualification, experience, clinic_name, clinic_address, city, consultation_fee, available_days, available_time, profile_image, identity_proof, degree_proof, clinic_reg_proof, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [username, email, hashedPassword, phone, gender, age, specialization, qualification, experience, clinic_name, clinic_address, city, consultation_fee, available_days, available_time, profile_image, identity_proof, degree_proof, clinic_reg_proof]
    );
    
    console.log('✅ Doctor registered successfully - ID:', result.insertId);
    res.status(201).json({ success: true, id: result.insertId, message: 'Doctor registered successfully. Awaiting admin approval.' });
  } catch (error) {
    console.error('❌ Error in POST /api/doctors:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update doctor
router.put('/:id', async (req, res) => {
  console.log('🔵 PUT /api/doctors/:id', req.params.id);
  try {
    const { username, email, phone, specialization, qualification, experience, clinic_address, city, consultation_fee } = req.body;
    
    await db.query(
      'UPDATE doctors SET username = ?, email = ?, phone = ?, specialization = ?, qualification = ?, experience = ?, clinic_address = ?, city = ?, consultation_fee = ? WHERE id = ?',
      [username, email, phone, specialization, qualification, experience, clinic_address, city, consultation_fee, req.params.id]
    );
    
    console.log('✅ Doctor updated successfully');
    res.json({ success: true, message: 'Doctor updated successfully' });
  } catch (error) {
    console.error('❌ Error in PUT /api/doctors/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Partially update doctor (for status approval, etc.)
router.patch('/:id', async (req, res) => {
  console.log('🔵 PATCH /api/doctors/:id', req.params.id);
  console.log('📦 Request body:', req.body);
  
  try {
    const updates = [];
    const values = [];
    
    // If status is being set to "Accept", automatically set is_verified to 1
    if (req.body.status === 'Accept') {
      req.body.is_verified = 1;
      console.log('✅ Auto-setting is_verified = 1 for approved doctor');
    }
    
    // Dynamically build update query based on provided fields
    Object.keys(req.body).forEach(key => {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    });
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(req.params.id);
    
    const query = `UPDATE doctors SET ${updates.join(', ')} WHERE id = ?`;
    console.log('🔍 Query:', query);
    console.log('🔍 Values:', values);
    const [result] = await db.query(query, values);
    
    if (result.affectedRows === 0) {
      console.log('❌ Doctor not found');
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    console.log('✅ Doctor updated successfully');
    res.json({ success: true, message: 'Doctor updated successfully' });
  } catch (error) {
    console.error('❌ Error in PATCH /api/doctors/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete doctor
router.delete('/:id', async (req, res) => {
  console.log('🔵 DELETE /api/doctors/:id', req.params.id);
  try {
    const [result] = await db.query('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ Doctor not found');
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    console.log('✅ Doctor deleted successfully');
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/doctors/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
