const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const { patient_id, doctor_id } = req.query;
    let query = `
      SELECT a.*, p.username as patient_name, d.username as doctor_name, d.specialization 
      FROM appointments a 
      LEFT JOIN patients p ON a.patient_id = p.id 
      LEFT JOIN doctors d ON a.doctor_id = d.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (patient_id) {
      query += ' AND a.patient_id = ?';
      params.push(patient_id);
    }
    if (doctor_id) {
      query += ' AND a.doctor_id = ?';
      params.push(doctor_id);
    }
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time, reason]
    );
    
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status (full update)
router.put('/:id', async (req, res) => {
  console.log('🔵 PUT /api/appointments/:id', req.params.id);
  try {
    const { status } = req.body;
    
    const [result] = await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ Appointment not found');
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    console.log('✅ Appointment updated successfully');
    res.json({ success: true, message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('❌ Error in PUT /api/appointments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Partially update appointment (for status changes, etc.)
router.patch('/:id', async (req, res) => {
  console.log('🔵 PATCH /api/appointments/:id', req.params.id);
  console.log('📦 Request body:', req.body);
  
  try {
    const updates = [];
    const values = [];
    
    // Dynamically build update query based on provided fields
    Object.keys(req.body).forEach(key => {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    });
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(req.params.id);
    
    const query = `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, values);
    
    if (result.affectedRows === 0) {
      console.log('❌ Appointment not found');
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    console.log('✅ Appointment updated successfully');
    res.json({ success: true, message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('❌ Error in PATCH /api/appointments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete appointment
router.delete('/:id', async (req, res) => {
  console.log('🔵 DELETE /api/appointments/:id', req.params.id);
  try {
    const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ Appointment not found');
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    console.log('✅ Appointment deleted successfully');
    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/appointments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
