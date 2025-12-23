const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const { doctor_id, status } = req.query;
    let query = `
      SELECT r.*, p.username as patient_name, d.username as doctor_name 
      FROM reviews r 
      LEFT JOIN patients p ON r.patient_id = p.id 
      LEFT JOIN doctors d ON r.doctor_id = d.id 
      WHERE 1=1
    `;
    const params = [];
    
    if (doctor_id) {
      query += ' AND r.doctor_id = ?';
      params.push(doctor_id);
    }
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, rating, comment } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO reviews (patient_id, doctor_id, rating, comment) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, rating, comment]
    );
    
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update review status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    await db.query('UPDATE reviews SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Review updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
