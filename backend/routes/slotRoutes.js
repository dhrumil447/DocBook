const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get slots by doctor
router.get('/', async (req, res) => {
  console.log('🔵 GET /api/slots');
  try {
    const { doctor_id } = req.query;
    
    if (doctor_id) {
      console.log('🔍 Fetching slots for doctor:', doctor_id);
      const [rows] = await db.query('SELECT * FROM slots WHERE doctor_id = ? AND is_available = TRUE ORDER BY slot_date, slot_time', [doctor_id]);
      console.log('✅ Found slots:', rows.length);
      return res.json(rows);
    }
    
    const [rows] = await db.query('SELECT * FROM slots ORDER BY slot_date, slot_time');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error in GET /api/slots:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create multiple slots
router.post('/', async (req, res) => {
  console.log('🔵 POST /api/slots');
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { doctor_id, availableSlots } = req.body;
    
    if (!doctor_id || !availableSlots) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'doctor_id and availableSlots are required' });
    }

    // First, delete existing slots for this doctor to avoid duplicates
    await db.query('DELETE FROM slots WHERE doctor_id = ?', [doctor_id]);
    console.log('🗑️ Cleared existing slots for doctor:', doctor_id);

    const insertedSlots = [];
    
    // Process each date
    for (const [date, dateInfo] of Object.entries(availableSlots)) {
      const { slots } = dateInfo;
      
      if (!slots || slots.length === 0) continue;
      
      // Convert date format from DD-MM-YYYY to YYYY-MM-DD
      const [day, month, year] = date.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      
      // Insert each slot
      for (const timeSlot of slots) {
        const [result] = await db.query(
          'INSERT INTO slots (doctor_id, slot_date, slot_time, is_available) VALUES (?, ?, ?, TRUE)',
          [doctor_id, formattedDate, timeSlot]
        );
        
        insertedSlots.push({
          id: result.insertId,
          date: formattedDate,
          time: timeSlot
        });
      }
    }
    
    console.log('✅ Inserted slots:', insertedSlots.length);
    res.status(201).json({ 
      success: true, 
      message: 'Slots created successfully',
      count: insertedSlots.length,
      slots: insertedSlots
    });
  } catch (error) {
    console.error('❌ Error in POST /api/slots:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update slot availability
router.put('/:id', async (req, res) => {
  console.log('🔵 PUT /api/slots/:id', req.params.id);
  try {
    const { is_available } = req.body;
    
    const [result] = await db.query('UPDATE slots SET is_available = ? WHERE id = ?', [is_available, req.params.id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ Slot not found');
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    console.log('✅ Slot updated successfully');
    res.json({ success: true, message: 'Slot updated successfully' });
  } catch (error) {
    console.error('❌ Error in PUT /api/slots/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete slot
router.delete('/:id', async (req, res) => {
  console.log('🔵 DELETE /api/slots/:id', req.params.id);
  try {
    const [result] = await db.query('DELETE FROM slots WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ Slot not found');
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    console.log('✅ Slot deleted successfully');
    res.json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/slots/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
