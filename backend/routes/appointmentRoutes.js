const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Get all appointments
router.get("/", async (req, res) => {
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
      query += " AND a.patient_id = ?";
      params.push(patient_id);
    }
    if (doctor_id) {
      query += " AND a.doctor_id = ?";
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
router.post("/", async (req, res) => {
  console.log("🔵 POST /api/appointments");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  console.log("📦 Request body type:", typeof req.body);
  console.log("📦 Request body keys:", Object.keys(req.body || {}));
  console.log("📦 Raw body:", req.body);

  try {
    // Check if body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("❌ Empty request body");
      return res.status(400).json({
        error: "Request body is empty",
        help: "Make sure Content-Type header is set to application/json",
      });
    }

    // Support both camelCase (from frontend) and snake_case field names
    const patientId = req.body.patientId || req.body.patient_id;
    const doctorId = req.body.doctorId || req.body.doctor_id;
    const date = req.body.date || req.body.appointment_date;
    const slot = req.body.slot || req.body.appointment_time;
    const status = req.body.status || "Pending";
    const reason = req.body.reason || "";

    console.log("🔍 Extracted values:", {
      patientId,
      doctorId,
      date,
      slot,
      status,
    });

    if (!patientId || !doctorId || !date || !slot) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        error: "Missing required fields",
        received: { patientId, doctorId, date, slot },
        required: [
          "patientId/patient_id",
          "doctorId/doctor_id",
          "date/appointment_date",
          "slot/appointment_time",
        ],
      });
    }

    // Ensure IDs are integers
    const patientIdInt = parseInt(patientId, 10);
    const doctorIdInt = parseInt(doctorId, 10);

    if (isNaN(patientIdInt) || isNaN(doctorIdInt)) {
      console.log("❌ Invalid ID format");
      return res.status(400).json({
        error: "Patient ID and Doctor ID must be valid numbers",
        received: { patientId, doctorId },
      });
    }

    // Convert date from DD-MM-YYYY to YYYY-MM-DD
    let appointmentDate = date;
    if (date.includes("-")) {
      const parts = date.split("-");
      if (parts[0].length === 2) {
        // Format is DD-MM-YYYY, convert to YYYY-MM-DD
        appointmentDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    // Extract start time from slot (e.g., "05:00 PM - 06:00 PM" -> "05:00 PM")
    let appointmentTime = slot;
    if (slot.includes("-")) {
      appointmentTime = slot.split("-")[0].trim();
    }

    // Convert 12-hour format to 24-hour format for TIME field
    const timeMatch = appointmentTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      const meridiem = timeMatch[3].toUpperCase();

      if (meridiem === "PM" && hours !== 12) {
        hours += 12;
      } else if (meridiem === "AM" && hours === 12) {
        hours = 0;
      }

      appointmentTime = `${String(hours).padStart(2, "0")}:${minutes}:00`;
    }

    console.log("📅 Formatted date:", appointmentDate);
    console.log("⏰ Formatted time:", appointmentTime);
    console.log("🔢 Using IDs:", {
      patientId: patientIdInt,
      doctorId: doctorIdInt,
    });

    const [result] = await db.query(
      "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason) VALUES (?, ?, ?, ?, ?, ?)",
      [
        patientIdInt,
        doctorIdInt,
        appointmentDate,
        appointmentTime,
        status,
        reason,
      ],
    );

    console.log("✅ Appointment created with ID:", result.insertId);
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status (full update)
router.put("/:id", async (req, res) => {
  console.log("🔵 PUT /api/appointments/:id", req.params.id);
  try {
    const { status } = req.body;

    const [result] = await db.query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      [status, req.params.id],
    );

    if (result.affectedRows === 0) {
      console.log("❌ Appointment not found");
      return res.status(404).json({ error: "Appointment not found" });
    }

    console.log("✅ Appointment updated successfully");
    res.json({ success: true, message: "Appointment updated successfully" });
  } catch (error) {
    console.error("❌ Error in PUT /api/appointments/:id:", error);
    res.status(500).json({ error: error.message });
  }
});

// Partially update appointment (for status changes, etc.)
router.patch("/:id", async (req, res) => {
  console.log("🔵 PATCH /api/appointments/:id", req.params.id);
  console.log("📦 Request body:", req.body);

  try {
    const updates = [];
    const values = [];

    // Dynamically build update query based on provided fields
    Object.keys(req.body).forEach((key) => {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.params.id);

    const query = `UPDATE appointments SET ${updates.join(", ")} WHERE id = ?`;
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      console.log("❌ Appointment not found");
      return res.status(404).json({ error: "Appointment not found" });
    }

    console.log("✅ Appointment updated successfully");
    res.json({ success: true, message: "Appointment updated successfully" });
  } catch (error) {
    console.error("❌ Error in PATCH /api/appointments/:id:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete appointment
router.delete("/:id", async (req, res) => {
  console.log("🔵 DELETE /api/appointments/:id", req.params.id);
  try {
    const [result] = await db.query("DELETE FROM appointments WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      console.log("❌ Appointment not found");
      return res.status(404).json({ error: "Appointment not found" });
    }

    console.log("✅ Appointment deleted successfully");
    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("❌ Error in DELETE /api/appointments/:id:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
