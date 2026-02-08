import React, { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router";
import { Card, Button, Table, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FaUserInjured,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaCheck,
  FaTimes,
  FaPrescriptionBottleAlt,
  FaEye,
  FaPills,
  FaPlus,
} from "react-icons/fa";
import { MdEmail, MdEventNote, MdDescription } from "react-icons/md";

const ViewAppointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    mealTiming: "",
  });
  const [description, setDescription] = useState("");
  const [nextAppointmentDate, setNextAppointmentDate] = useState("");

  useEffect(() => {
    const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (!doctorId) {
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/appointments?doctor_id=${doctorId}`,
        );
        const appointmentsWithPatients = await Promise.all(
          res.data.map(async (appt) => {
            // Use patient_id from backend response
            const patientId = appt.patient_id || appt.patientId;
            const patientRes = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/patients/${patientId}`,
            );

            // Fetch payment details
            let paymentMethod = "Not Paid";
            let razorpayId = "-";
            try {
              const paymentRes = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/payments?appointment_id=${appt.id}`,
              );
              if (paymentRes.data.length > 0) {
                paymentMethod = paymentRes.data[0].payment_method;
                razorpayId = paymentRes.data[0].razorpay_payment_id || "-";
              }
            } catch (error) {
              console.error("Error fetching payment details:", error);
            }

            return {
              ...appt,
              id: appt.id,
              patientId: appt.patient_id,
              doctorId: appt.doctor_id,
              date: appt.appointment_date,
              slot: appt.appointment_time,
              status: appt.status,
              patientName: patientRes.data.username,
              patientPhone: patientRes.data.phone,
              patientEmail: patientRes.data.email,
              paymentMethod,
              razorpayId,
              createdAt: appt.created_at,
            };
          }),
        );
        // Sort by creation date (newest first)
        const sortedAppointments = appointmentsWithPatients.sort((a, b) => {
          // If created_at exists, use it for sorting
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          // Fallback to ID sorting (higher ID = newer)
          return b.id - a.id;
        });
        setAppointments(sortedAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };
    fetchAppointments();
  }, [navigate]);

  const updateAppointmentStatus = async (
    id,
    status,
    patientEmail,
    patientName,
    appointmentDate,
    appointmentTime,
  ) => {
    try {
      if (status === "Cancelled") {
        // Delete the appointment if cancelled/rejected
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/appointments/${id}`,
        );
        toast.success("Appointment rejected and deleted successfully!");

        // Remove from local state
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      } else {
        // Update the appointment status if confirmed
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/appointments/${id}`,
          { status },
        );
        toast.success(
          `Appointment ${status === "Confirmed" ? "accepted" : status.toLowerCase()} successfully!`,
        );

        if (status === "Confirmed" && patientEmail) {
          emailjs
            .send(
              "service_rl0f4za",
              "template_zodqxou",
              {
                email: patientEmail,
                patient_name: patientName,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
              },
              { publicKey: "SwJM3G57VeGq0uvhd" },
            )
            .then((response) => {
              console.log("Email sent successfully:", response);
              toast.success("Email notification sent to patient!");
            })
            .catch((error) => {
              console.error("Error sending email:", error);
              toast.error(
                `Error sending email: ${error.text || "Unknown error"}`,
              );
            });
        }

        // Update local state
        setAppointments((prev) =>
          prev.map((appt) => (appt.id === id ? { ...appt, status } : appt)),
        );
      }
    } catch (err) {
      console.error("Error updating appointment status:", err);
      toast.error("Failed to update appointment status");
    }
  };

  const addMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.mealTiming) {
      toast.error("All fields are required.");
      return;
    }
    setMedicines([...medicines, newMedicine]);
    setNewMedicine({ name: "", dosage: "", mealTiming: "" });
  };

  const handleSubmitPrescription = async () => {
    if (medicines.length === 0) {
      toast.error("Please add at least one medicine.");
      return;
    }

    try {
      const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
      const appointmentId = selectedAppointment.id;
      const patientId = selectedAppointment.patientId;

      // Check if medical report already exists
      const existingReports = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/medicalReports?appointmentId=${appointmentId}`,
      );

      let updatedMedicines = [...medicines]; // Start with new medicines

      if (existingReports.data.length > 0) {
        const existingReport = existingReports.data[0]; // Get existing report
        updatedMedicines = [...existingReport.medicines, ...medicines]; // Merge old + new medicines

        // Update existing report
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/medicalReports/${existingReport.id}`,
          {
            medicines: updatedMedicines,
            description,
            nextAppointmentDate,
          },
        );

        toast.success("Prescription updated successfully!");
      } else {
        // Create new report
        await axios.post(`${import.meta.env.VITE_BASE_URL}/medicalReports`, {
          appointmentId,
          patientId,
          doctorId,
          medicines,
          description,
          nextAppointmentDate,
        });

        toast.success("Prescription & Medical Report saved successfully!");
      }

      setShowModal(false);
      setMedicines([]);
      setDescription("");
      setNextAppointmentDate("");
    } catch (err) {
      console.error("Error saving prescription:", err);
      toast.error("Failed to save prescription. Try again.");
    }
  };

  return (
    <div className="container mt-4">
      <style>{`
        .appointment-row {
          transition: all 0.3s ease;
        }
        .appointment-row:hover {
          background-color: #f8f9fa;
        }
      `}</style>

      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
          color: "white",
          boxShadow: "0 10px 30px rgba(13, 110, 253, 0.3)",
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
            <MdEventNote style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h2 style={{ margin: "0", fontWeight: "700", fontSize: "28px" }}>
              Appointments Management
            </h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "15px" }}>
              View and manage patient appointments
            </p>
          </div>
        </div>
      </div>

      <Card
        style={{
          border: "none",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        {appointments.length > 0 ? (
          <Table hover className="mb-0" style={{ fontSize: "14px" }}>
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
                  Patient
                </th>
                <th
                  style={{ padding: "15px", fontWeight: "600", border: "none" }}
                >
                  <FaPhone style={{ marginRight: "8px" }} />
                  Phone
                </th>
                <th
                  style={{ padding: "15px", fontWeight: "600", border: "none" }}
                >
                  <FaCalendarAlt style={{ marginRight: "8px" }} />
                  Date
                </th>
                <th
                  style={{ padding: "15px", fontWeight: "600", border: "none" }}
                >
                  <FaClock style={{ marginRight: "8px" }} />
                  Time
                </th>
                <th
                  style={{ padding: "15px", fontWeight: "600", border: "none" }}
                >
                  <FaMoneyBillWave style={{ marginRight: "8px" }} />
                  Payment
                </th>
                <th
                  style={{
                    padding: "15px",
                    fontWeight: "600",
                    border: "none",
                    textAlign: "center",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="appointment-row">
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
                            "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <FaUserInjured style={{ fontSize: "18px" }} />
                      </div>
                      <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {appt.patientName}
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
                    {appt.patientPhone}
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      verticalAlign: "middle",
                      color: "#495057",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FaCalendarAlt
                        style={{ color: "#0d6efd", fontSize: "14px" }}
                      />
                      {appt.date}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "15px",
                      verticalAlign: "middle",
                      color: "#495057",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FaClock style={{ color: "#6f42c1", fontSize: "14px" }} />
                      {appt.slot}
                    </div>
                  </td>
                  <td style={{ padding: "15px", verticalAlign: "middle" }}>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#495057",
                      }}
                    >
                      <div style={{ fontWeight: "600", marginBottom: "2px" }}>
                        {appt.paymentMethod}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6c757d" }}>
                        {appt.razorpayId}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "15px", verticalAlign: "middle" }}>
                    {appt.status === "Confirmed" ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          disabled
                          style={{
                            background:
                              "linear-gradient(135deg, #198754, #20c997)",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaCheck style={{ fontSize: "12px" }} />
                          Accepted
                        </Button>
                        <Button
                          style={{
                            background:
                              "linear-gradient(135deg, #0dcaf0, #0d6efd)",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.3s ease",
                          }}
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setShowModal(true);
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 4px 12px rgba(13, 110, 253, 0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <FaPrescriptionBottleAlt
                            style={{ fontSize: "12px" }}
                          />
                          Write Prescription
                        </Button>
                        <Button
                          style={{
                            background:
                              "linear-gradient(135deg, #6f42c1, #9d7bd8)",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.3s ease",
                          }}
                          onClick={() =>
                            navigate(`/doctor/prescription/${appt.id}`)
                          }
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 4px 12px rgba(111, 66, 193, 0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <FaEye style={{ fontSize: "12px" }} />
                          View
                        </Button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          style={{
                            background:
                              "linear-gradient(135deg, #198754, #20c997)",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.3s ease",
                          }}
                          onClick={() =>
                            updateAppointmentStatus(
                              appt.id,
                              "Confirmed",
                              appt.patientEmail,
                              appt.patientName,
                              appt.date,
                              appt.slot,
                            )
                          }
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 4px 12px rgba(25, 135, 84, 0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <FaCheck style={{ fontSize: "12px" }} />
                          Accept
                        </Button>
                        <Button
                          style={{
                            background:
                              "linear-gradient(135deg, #dc3545, #c82333)",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.3s ease",
                          }}
                          onClick={() =>
                            updateAppointmentStatus(appt.id, "Cancelled")
                          }
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 4px 12px rgba(220, 53, 69, 0.3)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <FaTimes style={{ fontSize: "12px" }} />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <MdEventNote
              style={{
                fontSize: "60px",
                color: "#d0d0d0",
                marginBottom: "15px",
              }}
            />
            <p style={{ color: "#6c757d", fontSize: "16px", margin: 0 }}>
              No appointments found.
            </p>
          </div>
        )}
      </Card>

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
            <FaPrescriptionBottleAlt style={{ fontSize: "24px" }} />
            Write Prescription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "25px" }}>
          <Form>
            {/* Medicines List */}
            {medicines.length > 0 && (
              <div
                style={{
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  padding: "15px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              >
                <h6
                  style={{
                    fontWeight: "600",
                    color: "#2c3e50",
                    marginBottom: "12px",
                  }}
                >
                  <FaPills style={{ marginRight: "8px", color: "#dc3545" }} />
                  Added Medicines:
                </h6>
                {medicines.map((med, index) => (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaPills style={{ color: "#dc3545", fontSize: "14px" }} />
                    <strong style={{ color: "#2c3e50" }}>{med.name}</strong>
                    <span style={{ color: "#6c757d" }}>
                      - {med.dosage}, {med.mealTiming}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Medicine Name */}
            <Form.Group className="mb-3">
              <Form.Label
                style={{
                  fontWeight: "600",
                  color: "#2c3e50",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaPills style={{ color: "#dc3545" }} />
                Medicine Name
              </Form.Label>
              <Form.Control
                type="text"
                value={newMedicine.name}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, name: e.target.value })
                }
                placeholder="Enter medicine name"
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e0e0e0",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
            </Form.Group>

            {/* Dosage Frequency */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>
                Dosage Frequency
              </Form.Label>
              <Form.Control
                as="select"
                value={newMedicine.dosage}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, dosage: e.target.value })
                }
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e0e0e0",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              >
                <option value="">Select Frequency</option>
                <option value="Once a day">Once a day</option>
                <option value="Twice a day">Twice a day</option>
                <option value="Thrice a day">Thrice a day</option>
              </Form.Control>
            </Form.Group>

            {/* Meal Timing */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>
                Meal Timing
              </Form.Label>
              <Form.Control
                as="select"
                value={newMedicine.mealTiming}
                onChange={(e) =>
                  setNewMedicine({ ...newMedicine, mealTiming: e.target.value })
                }
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e0e0e0",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0d6efd")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              >
                <option value="">Select Timing</option>
                <option value="Before Meals">Before Meals</option>
                <option value="After Meals">After Meals</option>
              </Form.Control>
            </Form.Group>

            <Button
              onClick={addMedicine}
              style={{
                background: "linear-gradient(135deg, #198754, #20c997)",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: "600",
                marginBottom: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(25, 135, 84, 0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <FaPlus style={{ fontSize: "14px" }} />
              Add Medicine
            </Button>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label
                style={{
                  fontWeight: "600",
                  color: "#2c3e50",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MdDescription style={{ color: "#6f42c1" }} />
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter prescription description or notes"
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e0e0e0",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6f42c1")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
            </Form.Group>

            {/* Next Appointment Date */}
            <Form.Group className="mb-3">
              <Form.Label
                style={{
                  fontWeight: "600",
                  color: "#2c3e50",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaCalendarAlt style={{ color: "#fd7e14" }} />
                Next Appointment Date
              </Form.Label>
              <Form.Control
                type="date"
                value={nextAppointmentDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNextAppointmentDate(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e0e0e0",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#fd7e14")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
            </Form.Group>

            <Button
              onClick={handleSubmitPrescription}
              style={{
                background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                border: "none",
                padding: "12px 30px",
                borderRadius: "10px",
                fontWeight: "600",
                width: "100%",
                fontSize: "16px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(13, 110, 253, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <FaCheck style={{ marginRight: "8px" }} />
              Submit Prescription
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewAppointment;
