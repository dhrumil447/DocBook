import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Card } from "react-bootstrap";
import moment from "moment";
import {
  FaSearch,
  FaUserInjured,
  FaEye,
  FaPills,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
} from "react-icons/fa";
import { MdPeople, MdMedicalServices } from "react-icons/md";

const DoctorPatients = () => {
  const [doctorId, setDoctorId] = useState(""); // Logged-in doctor ID
  const [patients, setPatients] = useState([]); // Past patients
  const [filteredPatients, setFilteredPatients] = useState([]); // Filtered patients based on search
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]); // Prescription details for selected patient
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering patients

  useEffect(() => {
    const loggedInDoctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (loggedInDoctorId) {
      setDoctorId(loggedInDoctorId);
      fetchCompletedAppointments(loggedInDoctorId);
    }
  }, []);

  const fetchCompletedAppointments = async (doctorId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/appointments?doctor_id=${doctorId}`,
      );
      // Filter for Confirmed appointments only
      const confirmedAppointments = response.data.filter(
        (appt) => appt.status === "Confirmed",
      );
      const uniquePatients = [];

      // Loop through appointments and fetch unique patients
      for (const appointment of confirmedAppointments) {
        // Use patient_id from backend response
        const patientId = appointment.patient_id || appointment.patientId;
        // Only add a patient if they are not already in the list
        if (!uniquePatients.some((p) => p.id === patientId)) {
          const patientRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/patients/${patientId}`,
          );
          uniquePatients.push({
            ...patientRes.data,
            appointmentDate: appointment.appointment_date || appointment.date,
            appointmentTime: appointment.appointment_time || appointment.slot,
          });
        }
      }

      setPatients(uniquePatients); // Set all patients
      setFilteredPatients(uniquePatients); // Set filtered patients based on search
    } catch (error) {
      console.error("Error fetching completed appointments:", error);
    }
  };

  const handleViewReport = async (patientId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/medicalReports?patientId=${patientId}`,
      );
      const reportsWithAppointments = await Promise.all(
        response.data.map(async (report) => {
          const appointmentRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/appointments/${report.appointmentId}`,
          );
          return {
            ...report,
            appointmentDate: appointmentRes.data.date, // Fetch appointment date
            appointmentTime: appointmentRes.data.slot, // Fetch appointment time
          };
        }),
      );

      setPrescriptions(reportsWithAppointments); // Set prescriptions with appointment details
      setSelectedPatient(patientId); // Set selected patient for the modal
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Convert search term to lowercase
    setSearchTerm(searchTerm); // Update search term
    const filtered = patients.filter(
      (patient) => patient.username.toLowerCase().includes(searchTerm), // Filter patients by name
    );
    setFilteredPatients(filtered); // Update filtered patients
  };

  return (
    <div className="container mt-4">
      <style>{`
        .patient-table-row {
          transition: all 0.3s ease;
        }
        .patient-table-row:hover {
          background-color: #f8f9fa;
          transform: scale(1.01);
        }
      `}</style>

      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #198754, #20c997)",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
          color: "white",
          boxShadow: "0 10px 30px rgba(25, 135, 84, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <MdPeople style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h2 style={{ margin: "0", fontWeight: "700", fontSize: "28px" }}>
              Patient Records
            </h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "15px" }}>
              View and manage your patient history
            </p>
          </div>
        </div>
      </div>

      {/* Search input field */}
      <Card
        style={{
          border: "none",
          borderRadius: "15px",
          padding: "20px",
          marginBottom: "25px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Form.Group className="mb-0">
          <div style={{ position: "relative" }}>
            <FaSearch
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
                fontSize: "18px",
              }}
            />
            <Form.Control
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                paddingLeft: "45px",
                padding: "14px 15px 14px 45px",
                borderRadius: "12px",
                border: "2px solid #e0e0e0",
                fontSize: "15px",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#198754")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>
        </Form.Group>
      </Card>

      {/* Patients Table */}
      <Card
        style={{
          border: "none",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table hover className="mb-0" style={{ fontSize: "15px" }}>
          <thead
            style={{
              background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
              color: "white",
            }}
          >
            <tr>
              <th
                style={{ padding: "15px", fontWeight: "600", border: "none" }}
              >
                <FaUserInjured style={{ marginRight: "8px" }} />
                Patient Name
              </th>
              <th
                style={{ padding: "15px", fontWeight: "600", border: "none" }}
              >
                Email
              </th>
              <th
                style={{
                  padding: "15px",
                  fontWeight: "600",
                  border: "none",
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <tr key={index} className="patient-table-row">
                  <td style={{ padding: "15px", verticalAlign: "middle" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #198754, #20c997)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <FaUserInjured style={{ fontSize: "18px" }} />
                      </div>
                      <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {patient.username}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      verticalAlign: "middle",
                      color: "#6c757d",
                    }}
                  >
                    {patient.email}
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      verticalAlign: "middle",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      style={{
                        background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => handleViewReport(patient.id)}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(13, 110, 253, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <FaEye style={{ fontSize: "16px" }} />
                      View Report
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6c757d",
                  }}
                >
                  <FaUserInjured
                    style={{
                      fontSize: "40px",
                      marginBottom: "10px",
                      opacity: 0.5,
                    }}
                  />
                  <p style={{ margin: 0 }}>No patients found</p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      {/* Modal for Viewing Reports */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
            color: "white",
            border: "none",
          }}
        >
          <Modal.Title
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <MdMedicalServices style={{ fontSize: "28px" }} />
            Patient Medical Reports
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "25px" }}>
          {prescriptions.length ? (
            prescriptions.map((prescription, index) => (
              <Card
                key={index}
                style={{
                  marginBottom: "20px",
                  border: "none",
                  borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #198754, #20c997)",
                    padding: "15px 20px",
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "8px",
                    }}
                  >
                    <FaCalendarAlt style={{ fontSize: "20px" }} />
                    <h5 style={{ margin: 0, fontWeight: "600" }}>
                      {prescription.appointmentDate}
                    </h5>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      opacity: 0.9,
                    }}
                  >
                    <FaClock style={{ fontSize: "16px" }} />
                    <span style={{ fontSize: "15px" }}>
                      {prescription.appointmentTime}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      background: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <FaFileAlt
                        style={{ color: "#0d6efd", fontSize: "18px" }}
                      />
                      <strong style={{ color: "#2c3e50" }}>Description:</strong>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "#6c757d",
                        paddingLeft: "26px",
                      }}
                    >
                      {prescription.description || "N/A"}
                    </p>
                  </div>

                  <div
                    style={{
                      background: "#fff3cd",
                      padding: "15px",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaCalendarAlt
                        style={{ color: "#fd7e14", fontSize: "18px" }}
                      />
                      <strong style={{ color: "#2c3e50" }}>
                        Next Appointment:
                      </strong>
                      <span style={{ color: "#6c757d", marginLeft: "5px" }}>
                        {prescription.nextAppointmentDate
                          ? moment(prescription.nextAppointmentDate).format(
                              "DD-MM-YYYY",
                            )
                          : "Not Scheduled"}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <FaPills style={{ color: "#dc3545", fontSize: "20px" }} />
                    <h6
                      style={{ margin: 0, fontWeight: "600", color: "#2c3e50" }}
                    >
                      Prescribed Medicines
                    </h6>
                  </div>
                  <Table hover style={{ marginBottom: 0, fontSize: "14px" }}>
                    <thead style={{ background: "#f8f9fa" }}>
                      <tr>
                        <th
                          style={{
                            padding: "12px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          Dosage
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          Meal Timing
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescription.medicines.map((med, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: "12px", color: "#495057" }}>
                            {med.name}
                          </td>
                          <td style={{ padding: "12px", color: "#495057" }}>
                            {med.dosage}
                          </td>
                          <td style={{ padding: "12px", color: "#495057" }}>
                            {med.mealTiming}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <FaFileAlt
                style={{
                  fontSize: "50px",
                  color: "#d0d0d0",
                  marginBottom: "15px",
                }}
              />
              <p style={{ color: "#6c757d", margin: 0 }}>
                No reports found for this patient.
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DoctorPatients;
