const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  console.log('🔵 GET /api/dashboard/stats');
  
  try {
    // Get counts
    const [doctorCount] = await db.query('SELECT COUNT(*) as total FROM doctors');
    const [patientCount] = await db.query('SELECT COUNT(*) as total FROM patients');
    const [appointmentCount] = await db.query('SELECT COUNT(*) as total FROM appointments');
    const [reviewCount] = await db.query('SELECT COUNT(*) as total FROM reviews');
    
    // Get payment statistics
    const [paymentStats] = await db.query(`
      SELECT 
        COUNT(*) as total_payments,
        SUM(CASE WHEN payment_method = 'Online' THEN amount ELSE 0 END) as total_online,
        SUM(CASE WHEN payment_method = 'Cash' OR payment_method = 'COD' OR payment_method = 'Pay on Counter' THEN amount ELSE 0 END) as total_cash,
        SUM(amount) as total_revenue
      FROM payments
      WHERE payment_status = 'Completed'
    `);
    
    // Get top doctor by appointments
    const [topDoctors] = await db.query(`
      SELECT 
        d.id,
        d.username,
        d.specialization,
        d.consultation_fee,
        COUNT(a.id) as appointment_count
      FROM doctors d
      LEFT JOIN appointments a ON d.id = a.doctor_id
      GROUP BY d.id
      ORDER BY appointment_count DESC
      LIMIT 1
    `);
    
    // Get highest rated doctor
    const [topRatedDoctors] = await db.query(`
      SELECT 
        d.id,
        d.username,
        d.specialization,
        AVG(r.rating) as avg_rating,
        COUNT(r.id) as review_count
      FROM doctors d
      LEFT JOIN reviews r ON d.id = r.doctor_id
      GROUP BY d.id
      HAVING review_count > 0
      ORDER BY avg_rating DESC
      LIMIT 1
    `);
    
    // Get recent appointments
    const [recentAppointments] = await db.query(`
      SELECT 
        a.*,
        p.username as patient_name,
        d.username as doctor_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.created_at DESC
      LIMIT 10
    `);
    
    // Appointment status breakdown
    const [appointmentStatus] = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM appointments
      GROUP BY status
    `);
    
    console.log('✅ Dashboard stats calculated');
    
    res.json({
      counts: {
        totalDoctors: doctorCount[0].total,
        totalPatients: patientCount[0].total,
        totalAppointments: appointmentCount[0].total,
        totalReviews: reviewCount[0].total
      },
      payments: {
        totalPayments: paymentStats[0].total_payments || 0,
        totalOnline: paymentStats[0].total_online || 0,
        totalCash: paymentStats[0].total_cash || 0,
        totalRevenue: paymentStats[0].total_revenue || 0
      },
      topDoctor: topDoctors[0] || null,
      topRatedDoctor: topRatedDoctors[0] ? {
        ...topRatedDoctors[0],
        avg_rating: parseFloat(topRatedDoctors[0].avg_rating).toFixed(1)
      } : null,
      recentAppointments,
      appointmentStatus
    });
  } catch (error) {
    console.error('❌ Error in GET /api/dashboard/stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get doctor-wise payment summary
router.get('/doctor-payments', async (req, res) => {
  console.log('🔵 GET /api/dashboard/doctor-payments');
  
  try {
    const [doctorPayments] = await db.query(`
      SELECT 
        d.id as doctor_id,
        d.username as doctor_name,
        d.specialization,
        COUNT(DISTINCT a.id) as total_appointments,
        COUNT(DISTINCT p.id) as total_payments,
        SUM(p.amount) as total_payment,
        SUM(CASE WHEN p.payment_method = 'Cash' OR p.payment_method = 'COD' OR p.payment_method = 'Pay on Counter' THEN p.amount ELSE 0 END) as cash_payment,
        SUM(CASE WHEN p.payment_method = 'Online' THEN p.amount ELSE 0 END) as online_payment
      FROM doctors d
      LEFT JOIN appointments a ON d.id = a.doctor_id
      LEFT JOIN payments p ON d.id = p.doctor_id
      GROUP BY d.id
      ORDER BY total_payment DESC
    `);
    
    console.log('✅ Doctor payment summary calculated');
    res.json(doctorPayments);
  } catch (error) {
    console.error('❌ Error in GET /api/dashboard/doctor-payments:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
