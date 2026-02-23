const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Get all medical reports (with optional filters)
router.get("/", async (req, res) => {
  console.log("🔵 GET /api/medicalReports");
  try {
    const { appointmentId, patientId, doctorId } = req.query;
    let query = `
      SELECT pr.*, 
             p.username as patient_name, 
             d.username as doctor_name,
             a.appointment_date,
             a.appointment_time
      FROM prescriptions pr
      LEFT JOIN patients p ON pr.patient_id = p.id
      LEFT JOIN doctors d ON pr.doctor_id = d.id
      LEFT JOIN appointments a ON pr.appointment_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (appointmentId) {
      query += " AND pr.appointment_id = ?";
      params.push(appointmentId);
    }
    if (patientId) {
      query += " AND pr.patient_id = ?";
      params.push(patientId);
    }
    if (doctorId) {
      query += " AND pr.doctor_id = ?";
      params.push(doctorId);
    }

    query += " ORDER BY pr.created_at DESC";

    const [rows] = await db.query(query, params);

    // Parse medicines JSON string to object
    const formattedRows = rows.map((row) => ({
      ...row,
      medicines:
        typeof row.medicines === "string"
          ? JSON.parse(row.medicines)
          : row.medicines,
    }));

    console.log(`✅ Found ${formattedRows.length} medical reports`);
    res.json(formattedRows);
  } catch (error) {
    console.error("❌ Error fetching medical reports:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get single medical report by ID
router.get("/:id", async (req, res) => {
  console.log("🔵 GET /api/medicalReports/:id", req.params.id);
  try {
    const [rows] = await db.query(
      `SELECT pr.*, 
              p.username as patient_name, 
              d.username as doctor_name,
              a.appointment_date,
              a.appointment_time
       FROM prescriptions pr
       LEFT JOIN patients p ON pr.patient_id = p.id
       LEFT JOIN doctors d ON pr.doctor_id = d.id
       LEFT JOIN appointments a ON pr.appointment_id = a.id
       WHERE pr.id = ?`,
      [req.params.id],
    );

    if (rows.length === 0) {
      console.log("❌ Medical report not found");
      return res.status(404).json({ error: "Medical report not found" });
    }

    // Parse medicines JSON string to object
    const report = {
      ...rows[0],
      medicines:
        typeof rows[0].medicines === "string"
          ? JSON.parse(rows[0].medicines)
          : rows[0].medicines,
    };

    console.log("✅ Medical report found");
    res.json(report);
  } catch (error) {
    console.error("❌ Error fetching medical report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create new medical report
router.post("/", async (req, res) => {
  console.log("🔵 POST /api/medicalReports");
  console.log("📦 Request body:", req.body);

  try {
    const {
      appointmentId,
      patientId,
      doctorId,
      medicines,
      description,
      nextAppointmentDate,
      date,
    } = req.body;

    if (!appointmentId || !patientId || !doctorId || !medicines) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["appointmentId", "patientId", "doctorId", "medicines"],
      });
    }

    // Convert medicines array to JSON string
    const medicinesJson = JSON.stringify(medicines);

    // Map frontend fields to database columns
    // description -> diagnosis
    // nextAppointmentDate -> notes (we'll store it as a note)
    const diagnosis = description || "";
    const notes = nextAppointmentDate
      ? `Next appointment: ${nextAppointmentDate}`
      : "";

    const [result] = await db.query(
      `INSERT INTO prescriptions 
        (appointment_id, patient_id, doctor_id, medicines, diagnosis, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [appointmentId, patientId, doctorId, medicinesJson, diagnosis, notes],
    );

    console.log("✅ Medical report created with ID:", result.insertId);
    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Medical report created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating medical report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update medical report
router.patch("/:id", async (req, res) => {
  console.log("🔵 PATCH /api/medicalReports/:id", req.params.id);
  console.log("📦 Request body:", req.body);

  try {
    const updates = [];
    const values = [];

    // Handle medicines separately to stringify if it's an array
    Object.keys(req.body).forEach((key) => {
      if (key === "medicines" && Array.isArray(req.body[key])) {
        updates.push(`${key} = ?`);
        values.push(JSON.stringify(req.body[key]));
      } else {
        updates.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.params.id);

    const query = `UPDATE prescriptions SET ${updates.join(", ")} WHERE id = ?`;
    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      console.log("❌ Medical report not found");
      return res.status(404).json({ error: "Medical report not found" });
    }

    console.log("✅ Medical report updated successfully");
    res.json({ success: true, message: "Medical report updated successfully" });
  } catch (error) {
    console.error("❌ Error updating medical report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete medical report
router.delete("/:id", async (req, res) => {
  console.log("🔵 DELETE /api/medicalReports/:id", req.params.id);
  try {
    const [result] = await db.query("DELETE FROM prescriptions WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      console.log("❌ Medical report not found");
      return res.status(404).json({ error: "Medical report not found" });
    }

    console.log("✅ Medical report deleted successfully");
    res.json({ success: true, message: "Medical report deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting medical report:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
