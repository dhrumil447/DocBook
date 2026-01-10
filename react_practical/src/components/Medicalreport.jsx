import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Button, Form } from "react-bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import moment from "moment"; // For date formatting

const UserPrescription = () => {
  const [patientId, setPatientId] = useState(""); 
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    const loggedInPatientId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (loggedInPatientId) {
      setPatientId(loggedInPatientId);
      fetchPrescriptions(loggedInPatientId);
    } else {
      console.error("No patient ID found in sessionStorage");
    }
  }, []);

  const fetchPrescriptions = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/medicalReports?patientId=${id}`);
      
      const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${id}`); // Fetch patient details

      const prescriptionsWithDetails = await Promise.all(
        response.data.map(async (prescription) => {
          const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${prescription.doctorId}`);
          const appointmentRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments/${prescription.appointmentId}`);

          return {
            ...prescription,
            doctorName: doctorRes.data.username,
            appointmentDate: appointmentRes.data.date,
            appointmentTime: appointmentRes.data.slot,
            patientName: patientRes.data.username,  
            patientId: patientRes.data.id,  
            patientAge: patientRes.data.age, 
            patientGender: patientRes.data.gender, 
          };
        })
      );

      setPrescriptions(prescriptionsWithDetails);
      setFilteredPrescriptions(prescriptionsWithDetails);
    } catch (error) {
      console.error("Error fetching medical reports:", error);
    }
  };

  const handleSearch = () => {
    const filtered = prescriptions.filter((prescription) =>
      prescription.doctorName.toLowerCase().includes(doctorName.toLowerCase())
    );
    setFilteredPrescriptions(filtered);
  };

  const generatePDF = (prescription) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Medical Prescription", 14, 20);

    doc.setFontSize(12);
    doc.text(`Patient Name: ${prescription.patientName || "N/A"}`, 14, 30);
    doc.text(`Patient ID: ${prescription.patientId || "N/A"}`, 14, 40);
    doc.text(`Age: ${prescription.patientAge || "N/A"}`, 14, 50);
    doc.text(`Gender: ${prescription.patientGender || "N/A"}`, 14, 60);

    doc.text(`Doctor Name: Dr. ${prescription.doctorName}`, 14, 75);
    doc.text(`Appointment Date: ${moment(prescription.date).format("DD-MM-YYYY")}`, 14, 85);
    doc.text(`Appointment Time: ${prescription.appointmentTime}`, 14, 95);
    doc.text(`Description: ${prescription.description || "N/A"}`, 14, 105);

    if (prescription.nextAppointmentDate) {
      doc.text(`Next Appointment Date: ${moment(prescription.nextAppointmentDate).format("DD-MM-YYYY")}`, 14, 115);
    }

    // Medicines Table
    autoTable(doc, {
      startY: 125,
      head: [["Medicine Name", "Dosage", "Meal Timing"]],
      body: prescription.medicines.map((med) => [med.name, med.dosage, med.mealTiming]),
    });

    doc.save(`Prescription_${prescription.appointmentId}.pdf`);
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 20px" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ 
            color: "#2c3e50",
            fontSize: "2.5rem"
          }}>
            My Prescriptions
          </h2>
          <p className="text-muted">View and download your medical reports</p>
        </div>

        {/* Search Form */}
        <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: "15px" }}>
          <Card.Body className="p-4">
            <Form>
              <div className="row align-items-end">
                <div className="col-md-9">
                  <Form.Group controlId="doctorName">
                    <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>Search by Doctor Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter doctor's name..."
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid #e9ecef",
                        fontSize: "15px"
                      }}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Button 
                    variant="primary" 
                    onClick={handleSearch}
                    className="w-100"
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      fontWeight: "600",
                      border: "none"
                    }}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {filteredPrescriptions.length === 0 ? (
          <Card className="text-center border-0 shadow-sm" style={{ borderRadius: "15px", padding: "60px 20px" }}>
            <h4 className="text-muted">No Medical Reports Found</h4>
            <p className="text-muted">Your prescriptions will appear here once available</p>
          </Card>
        ) : (
          filteredPrescriptions.map((prescription, index) => (
            <Card key={index} className="mb-4 border-0 shadow-sm" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <div style={{ 
                background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                padding: "20px",
                color: "white"
              }}>
                <h5 className="fw-bold mb-0">Dr. {prescription.doctorName}</h5>
                <small>{moment(prescription.appointmentDate).format("DD MMMM YYYY")} at {prescription.appointmentTime}</small>
              </div>
              
              <Card.Body className="p-4">
                <Table borderless responsive>
                  <tbody>
                    <tr>
                      <td style={{ width: "200px", fontWeight: "600", color: "#2c3e50" }}>Description:</td>
                      <td style={{ color: "#6c757d" }}>{prescription.description || "N/A"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600", color: "#2c3e50" }}>Next Appointment:</td>
                      <td style={{ color: "#6c757d" }}>
                        {prescription.nextAppointmentDate ? moment(prescription.nextAppointmentDate).format("DD MMMM YYYY") : "Not Scheduled"}
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <h6 className="fw-bold mt-4 mb-3" style={{ color: "#2c3e50" }}>Prescribed Medicines</h6>
                <Table bordered hover responsive style={{ borderRadius: "10px", overflow: "hidden" }}>
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th style={{ fontWeight: "600", color: "#2c3e50" }}>Medicine Name</th>
                      <th style={{ fontWeight: "600", color: "#2c3e50" }}>Dosage</th>
                      <th style={{ fontWeight: "600", color: "#2c3e50" }}>Meal Timing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescription.medicines.map((medicine, idx) => (
                      <tr key={idx}>
                        <td>{medicine.name}</td>
                        <td>{medicine.dosage}</td>
                        <td>{medicine.mealTiming}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="text-end mt-4">
                  <Button 
                    variant="primary" 
                    onClick={() => generatePDF(prescription)}
                    style={{
                      padding: "12px 30px",
                      borderRadius: "10px",
                      fontWeight: "600",
                      border: "none"
                    }}
                  >
                    📥 Download PDF
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UserPrescription;
