const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all payments
router.get('/', async (req, res) => {
  console.log('🔵 GET /api/payments');
  try {
    const { appointment_id, patient_id, doctor_id } = req.query;
    
    let query = `
      SELECT 
        pay.*,
        p.username as patient_name,
        p.phone as patient_phone,
        p.email as patient_email,
        d.username as doctor_name,
        d.specialization as doctor_specialization
      FROM payments pay
      LEFT JOIN patients p ON pay.patient_id = p.id
      LEFT JOIN doctors d ON pay.doctor_id = d.id
      WHERE 1=1
    `;
    const params = [];
    
    if (appointment_id) {
      query += ' AND pay.appointment_id = ?';
      params.push(appointment_id);
    }
    if (patient_id) {
      query += ' AND pay.patient_id = ?';
      params.push(patient_id);
    }
    if (doctor_id) {
      query += ' AND pay.doctor_id = ?';
      params.push(doctor_id);
    }
    
    query += ' ORDER BY pay.created_at DESC';
    
    const [rows] = await db.query(query, params);
    console.log('✅ Found payments:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error in GET /api/payments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  console.log('🔵 GET /api/payments/:id', req.params.id);
  try {
    const [rows] = await db.query(`
      SELECT 
        pay.*,
        p.username as patient_name,
        d.username as doctor_name
      FROM payments pay
      LEFT JOIN patients p ON pay.patient_id = p.id
      LEFT JOIN doctors d ON pay.doctor_id = d.id
      WHERE pay.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      console.log('❌ Payment not found');
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    console.log('✅ Payment found');
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error in GET /api/payments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create payment
router.post('/', async (req, res) => {
  console.log('🔵 POST /api/payments');
  console.log('📦 Request body:', req.body);
  
  try {
    const { 
      appointment_id, 
      patient_id, 
      doctor_id, 
      amount, 
      payment_method, 
      payment_status, 
      razorpay_payment_id,
      razorpay_order_id 
    } = req.body;

    // Validation
    if (!patient_id || !doctor_id || !amount || !payment_method) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Patient ID, Doctor ID, Amount, and Payment Method are required' 
      });
    }

    console.log('💾 Inserting payment into database...');
    const [result] = await db.query(
      `INSERT INTO payments 
      (appointment_id, patient_id, doctor_id, amount, payment_method, payment_status, razorpay_payment_id, razorpay_order_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointment_id || null, 
        patient_id, 
        doctor_id, 
        amount, 
        payment_method, 
        payment_status || 'Completed',
        razorpay_payment_id || null,
        razorpay_order_id || null
      ]
    );

    console.log('✅ Payment created successfully - ID:', result.insertId);
    res.status(201).json({ 
      success: true, 
      id: result.insertId,
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    console.error('❌ Error in POST /api/payments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  console.log('🔵 PUT /api/payments/:id', req.params.id);
  console.log('📦 Request body:', req.body);
  
  try {
    const { payment_status, razorpay_payment_id, razorpay_order_id, amount, payment_method } = req.body;
    
    const [result] = await db.query(
      `UPDATE payments 
      SET payment_status = COALESCE(?, payment_status),
          razorpay_payment_id = COALESCE(?, razorpay_payment_id),
          razorpay_order_id = COALESCE(?, razorpay_order_id),
          amount = COALESCE(?, amount),
          payment_method = COALESCE(?, payment_method)
      WHERE id = ?`,
      [payment_status, razorpay_payment_id, razorpay_order_id, amount, payment_method, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      console.log('❌ Payment not found');
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    console.log('✅ Payment updated successfully');
    res.json({ success: true, message: 'Payment updated successfully' });
  } catch (error) {
    console.error('❌ Error in PUT /api/payments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  console.log('🔵 DELETE /api/payments/:id', req.params.id);
  
  try {
    const [result] = await db.query('DELETE FROM payments WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ Payment not found');
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    console.log('✅ Payment deleted successfully');
    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/payments/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment statistics
router.get('/stats/summary', async (req, res) => {
  console.log('🔵 GET /api/payments/stats/summary');
  
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_payments,
        SUM(CASE WHEN payment_method = 'Online' THEN amount ELSE 0 END) as total_online,
        SUM(CASE WHEN payment_method = 'Cash' OR payment_method = 'COD' OR payment_method = 'Pay on Counter' THEN amount ELSE 0 END) as total_cash,
        SUM(amount) as total_revenue,
        AVG(amount) as average_payment
      FROM payments
      WHERE payment_status = 'Completed'
    `);
    
    console.log('✅ Payment stats calculated');
    res.json(stats[0]);
  } catch (error) {
    console.error('❌ Error in GET /api/payments/stats/summary:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
