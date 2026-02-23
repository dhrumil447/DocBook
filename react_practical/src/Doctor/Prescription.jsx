import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Card, Table, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaUserInjured,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaPills,
  FaPrint,
  FaFileAlt,
  FaPlus,
  FaSave,
  FaEdit,
} from "react-icons/fa";
import { MdMedicalServices, MdDescription } from "react-icons/md";

const Prescription = () => {
  const { id } = useParams(); // appointmentId from URL
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", mealTiming: "After Meal" },
  ]);
  const [description, setDescription] = useState("");
  const [nextAppointmentDate, setNextAppointmentDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch appointment details first
        const appointmentRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/appointments/${id}`,
        );
        setAppointment(appointmentRes.data);

        // Fetch patient data
        const patientRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patients/${appointmentRes.data.patient_id}`,
        );
        setPatient(patientRes.data);

        // Fetch prescription data
        const prescRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/medicalReports?appointmentId=${id}`,
        );
        if (prescRes.data.length === 0) {
          // No prescription found, show form
          setShowForm(true);
        } else {
          const prescriptionData = prescRes.data[0];
          setPrescription(prescriptionData);
          setMedicines(prescriptionData.medicines || []);
          setDescription(prescriptionData.diagnosis || "");
          const nextApptDate =
            prescriptionData.notes?.replace("Next appointment: ", "") || "";
          setNextAppointmentDate(nextApptDate);
          setShowForm(false);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Form handling functions
  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", mealTiming: "After Meal" },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();

    // Validate form
    if (medicines.some((med) => !med.name || !med.dosage)) {
      toast.error("Please fill all medicine fields");
      return;
    }

    if (!description) {
      toast.error("Please enter description");
      return;
    }

    try {
      const doctorData = JSON.parse(sessionStorage.getItem("DocBook"));

      const prescriptionData = {
        appointmentId: parseInt(id),
        patientId: appointment.patient_id,
        doctorId: doctorData.id,
        medicines: medicines,
        description: description,
        nextAppointmentDate: nextAppointmentDate || null,
        date: new Date().toISOString().split("T")[0],
      };

      if (isEditMode && prescription) {
        // Update existing prescription
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/medicalReports/${prescription.id}`,
          {
            medicines: medicines,
            diagnosis: description,
            notes: nextAppointmentDate
              ? `Next appointment: ${nextAppointmentDate}`
              : "",
          },
        );
        toast.success("Prescription updated successfully!");
      } else {
        // Create new prescription
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/medicalReports`,
          prescriptionData,
        );
        // Update appointment status to Completed
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/appointments/${id}`,
          {
            status: "Completed",
          },
        );
        toast.success("Prescription saved successfully!");
      }

      // Refresh data
      const prescRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/medicalReports?appointmentId=${id}`,
      );
      setPrescription(prescRes.data[0]);
      setShowForm(false);
      setIsEditMode(false);
    } catch (err) {
      console.error("Error saving prescription:", err);
      toast.error("Failed to save prescription");
    }
  };

  const handleEditPrescription = () => {
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleDeleteMedicine = async (index) => {
    try {
      const updatedMedicines = prescription.medicines.filter(
        (_, i) => i !== index,
      );
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/medicalReports/${prescription.id}`,
        { medicines: updatedMedicines },
      );
      setPrescription((prev) => ({ ...prev, medicines: updatedMedicines }));
      toast.success("Medicine deleted successfully!");
    } catch (err) {
      console.error("Error deleting medicine:", err);
      toast.error("Failed to delete medicine.");
    }
  };

  const handlePrint = () => {
    let olddata = document.body.innerHTML;
    document.body.innerHTML = document.getElementById("data").innerHTML;
    window.print();
    document.body.innerHTML = olddata;
  };

  if (loading || !patient || !appointment) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
            marginBottom: "20px",
            animation: "pulse 2s infinite",
          }}
        >
          <MdMedicalServices style={{ fontSize: "40px", color: "white" }} />
        </div>
        <h4 style={{ color: "#0d6efd" }}>Loading...</h4>
      </div>
    );
  }

  // PRESCRIPTION FORM VIEW
  if (showForm) {
    return (
      <div className="container mt-4 p-2">
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .medicine-row:hover {
            background-color: #f8f9fa;
          }
        `}</style>

        <Card
          style={{
            border: "none",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
              padding: "30px",
              textAlign: "center",
              color: "white",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                marginBottom: "15px",
              }}
            >
              <FaPills style={{ fontSize: "35px" }} />
            </div>
            <h3 style={{ margin: "0", fontWeight: "700", fontSize: "28px" }}>
              Write Prescription
            </h3>
            <p style={{ margin: "8px 0 0 0", opacity: 0.9, fontSize: "15px" }}>
              Create Medical Prescription for Patient
            </p>
          </div>

          <div style={{ padding: "30px" }}>
            {/* Patient Details */}
            <div
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                padding: "20px",
                borderRadius: "15px",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <FaUserInjured style={{ color: "#0d6efd", fontSize: "22px" }} />
                <h5 style={{ margin: 0, fontWeight: "700", color: "#2c3e50" }}>
                  Patient Information
                </h5>
              </div>
              <Row>
                <Col md={4}>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Name:</strong> {patient.username}
                  </p>
                </Col>
                <Col md={4}>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Phone:</strong> {patient.phone}
                  </p>
                </Col>
                <Col md={4}>
                  <p style={{ margin: "5px 0", fontSize: "14px" }}>
                    <strong>Email:</strong> {patient.email}
                  </p>
                </Col>
              </Row>
            </div>

            {/* Prescription Form */}
            <Form onSubmit={handleSubmitPrescription}>
              {/* Medicines Section */}
              <div
                style={{
                  background: "linear-gradient(135deg, #e7f3ff, #cfe7ff)",
                  padding: "25px",
                  borderRadius: "15px",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FaPills style={{ color: "#0d6efd", fontSize: "22px" }} />
                    <h5
                      style={{ margin: 0, fontWeight: "700", color: "#2c3e50" }}
                    >
                      Medicines
                    </h5>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddMedicine}
                    style={{
                      background: "linear-gradient(135deg, #198754, #20c997)",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "600",
                    }}
                  >
                    <FaPlus /> Add Medicine
                  </Button>
                </div>

                {medicines.map((medicine, index) => (
                  <Row
                    key={index}
                    className="medicine-row"
                    style={{
                      padding: "15px",
                      marginBottom: "15px",
                      background: "white",
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label
                          style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "#495057",
                          }}
                        >
                          Medicine Name <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter medicine name"
                          value={medicine.name}
                          onChange={(e) =>
                            handleMedicineChange(index, "name", e.target.value)
                          }
                          required
                          style={{ borderRadius: "8px", padding: "10px" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label
                          style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "#495057",
                          }}
                        >
                          Dosage <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g., 1-0-1"
                          value={medicine.dosage}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "dosage",
                              e.target.value,
                            )
                          }
                          required
                          style={{ borderRadius: "8px", padding: "10px" }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label
                          style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "#495057",
                          }}
                        >
                          Meal Timing
                        </Form.Label>
                        <Form.Select
                          value={medicine.mealTiming}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "mealTiming",
                              e.target.value,
                            )
                          }
                          style={{ borderRadius: "8px", padding: "10px" }}
                        >
                          <option value="Before Meal">Before Meal</option>
                          <option value="After Meal">After Meal</option>
                          <option value="With Meal">With Meal</option>
                          <option value="Empty Stomach">Empty Stomach</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2} style={{ display: "flex", alignItems: "end" }}>
                      {medicines.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveMedicine(index)}
                          style={{
                            background:
                              "linear-gradient(135deg, #dc3545, #c82333)",
                            border: "none",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            width: "100%",
                          }}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
              </div>

              {/* Description */}
              <div
                style={{
                  background: "linear-gradient(135deg, #fff3cd, #ffe69c)",
                  padding: "25px",
                  borderRadius: "15px",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <MdDescription
                    style={{ color: "#fd7e14", fontSize: "22px" }}
                  />
                  <h5
                    style={{ margin: 0, fontWeight: "700", color: "#2c3e50" }}
                  >
                    Description & Notes
                  </h5>
                </div>
                <Form.Group>
                  <Form.Label
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#495057",
                    }}
                  >
                    Additional Information{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter symptoms, diagnosis, advice, or any additional notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{ borderRadius: "10px", padding: "12px" }}
                  />
                </Form.Group>
              </div>

              {/* Next Appointment */}
              <div
                style={{
                  background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
                  padding: "25px",
                  borderRadius: "15px",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <FaCalendarAlt
                    style={{ color: "#198754", fontSize: "22px" }}
                  />
                  <h5
                    style={{ margin: 0, fontWeight: "700", color: "#2c3e50" }}
                  >
                    Follow-up
                  </h5>
                </div>
                <Form.Group>
                  <Form.Label
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#495057",
                    }}
                  >
                    Next Appointment Date (Optional)
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={nextAppointmentDate}
                    onChange={(e) => setNextAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    style={{ borderRadius: "10px", padding: "12px" }}
                  />
                </Form.Group>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                    border: "none",
                    padding: "15px 50px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "700",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 25px rgba(13, 110, 253, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 15px rgba(13, 110, 253, 0.3)";
                  }}
                >
                  <FaSave style={{ fontSize: "18px" }} />
                  {isEditMode ? "Update Prescription" : "Save Prescription"}
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    );
  }

  // EXISTING PRESCRIPTION VIEW
  if (!prescription) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
            marginBottom: "20px",
            animation: "pulse 2s infinite",
          }}
        >
          <MdMedicalServices style={{ fontSize: "40px", color: "white" }} />
        </div>
        <h4 style={{ color: "#0d6efd" }}>Loading prescription...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4 p-2" id="data">
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <Card
        style={{
          border: "none",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
            padding: "30px",
            textAlign: "center",
            color: "white",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              marginBottom: "15px",
            }}
          >
            <MdMedicalServices style={{ fontSize: "35px" }} />
          </div>
          <h3 style={{ margin: "0", fontWeight: "700", fontSize: "28px" }}>
            Medical Prescription
          </h3>
          <p style={{ margin: "8px 0 0 0", opacity: 0.9, fontSize: "15px" }}>
            Complete Patient Treatment Record
          </p>
        </div>

        <div style={{ padding: "30px" }}>
          {/* Print Button */}
          <div
            className="no-print"
            style={{
              textAlign: "right",
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={handleEditPrescription}
              style={{
                background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                border: "none",
                padding: "12px 25px",
                borderRadius: "10px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
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
              <FaEdit style={{ fontSize: "16px" }} />
              Edit Prescription
            </Button>
            <Button
              onClick={handlePrint}
              style={{
                background: "linear-gradient(135deg, #198754, #20c997)",
                border: "none",
                padding: "12px 25px",
                borderRadius: "10px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(25, 135, 84, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <FaPrint style={{ fontSize: "16px" }} />
              Print Report
            </Button>
          </div>

          {/* Patient Details */}
          <div
            style={{
              background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <FaUserInjured style={{ color: "#0d6efd", fontSize: "22px" }} />
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2c3e50" }}>
                Patient Information
              </h5>
            </div>
            <Table borderless style={{ marginBottom: 0, fontSize: "15px" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      width: "30%",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    <FaUserInjured
                      style={{ marginRight: "8px", color: "#0d6efd" }}
                    />
                    Name:
                  </td>
                  <td style={{ padding: "10px", color: "#2c3e50" }}>
                    {patient.username}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    <FaEnvelope
                      style={{ marginRight: "8px", color: "#0d6efd" }}
                    />
                    Email:
                  </td>
                  <td style={{ padding: "10px", color: "#2c3e50" }}>
                    {patient.email}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    <FaPhone style={{ marginRight: "8px", color: "#0d6efd" }} />
                    Phone:
                  </td>
                  <td style={{ padding: "10px", color: "#2c3e50" }}>
                    {patient.phone}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Appointment Details */}
          <div
            style={{
              background: "linear-gradient(135deg, #fff3cd, #ffe69c)",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <FaCalendarAlt style={{ color: "#fd7e14", fontSize: "22px" }} />
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2c3e50" }}>
                Appointment Information
              </h5>
            </div>
            <Table borderless style={{ marginBottom: 0, fontSize: "15px" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      width: "30%",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    <FaCalendarAlt
                      style={{ marginRight: "8px", color: "#fd7e14" }}
                    />
                    Date:
                  </td>
                  <td style={{ padding: "10px", color: "#2c3e50" }}>
                    {appointment.appointment_date
                      ? new Date(
                          appointment.appointment_date,
                        ).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    <FaClock style={{ marginRight: "8px", color: "#fd7e14" }} />
                    Time Slot:
                  </td>
                  <td style={{ padding: "10px", color: "#2c3e50" }}>
                    {appointment.appointment_time || "N/A"}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Prescription Details */}
          <div
            style={{
              background: "linear-gradient(135deg, #e7f3ff, #cfe7ff)",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <FaPills style={{ color: "#dc3545", fontSize: "22px" }} />
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2c3e50" }}>
                Prescribed Medicines
              </h5>
            </div>
            <Table
              hover
              style={{
                marginBottom: 0,
                fontSize: "14px",
                background: "white",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <thead
                style={{
                  background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                  color: "white",
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    Medicine Name
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    Dosage
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    Meal Timing
                  </th>
                  <th
                    className="no-print"
                    style={{
                      padding: "12px",
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
                {prescription.medicines.map((med, index) => (
                  <tr key={index} style={{ transition: "all 0.3s ease" }}>
                    <td
                      style={{
                        padding: "12px",
                        color: "#2c3e50",
                        fontWeight: "600",
                      }}
                    >
                      <FaPills
                        style={{
                          marginRight: "8px",
                          color: "#dc3545",
                          fontSize: "14px",
                        }}
                      />
                      {med.name}
                    </td>
                    <td style={{ padding: "12px", color: "#495057" }}>
                      {med.dosage}
                    </td>
                    <td style={{ padding: "12px", color: "#495057" }}>
                      {med.mealTiming}
                    </td>
                    <td
                      className="no-print"
                      style={{ padding: "12px", textAlign: "center" }}
                    >
                      <Button
                        size="sm"
                        onClick={() => handleDeleteMedicine(index)}
                        style={{
                          background:
                            "linear-gradient(135deg, #dc3545, #c82333)",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = "scale(1.1)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Additional Information */}
          <div
            style={{
              background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
              padding: "20px",
              borderRadius: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <FaFileAlt style={{ color: "#198754", fontSize: "22px" }} />
              <h5 style={{ margin: 0, fontWeight: "700", color: "#2c3e50" }}>
                Additional Information
              </h5>
            </div>
            <Table borderless style={{ marginBottom: 0, fontSize: "15px" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      width: "30%",
                      fontWeight: "600",
                      color: "#495057",
                      verticalAlign: "top",
                    }}
                  >
                    <MdDescription
                      style={{ marginRight: "8px", color: "#198754" }}
                    />
                    Description:
                  </td>
                  <td style={{ padding: "10px", color: "#2c3e50" }}>
                    {prescription.diagnosis || "No description provided"}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    <FaCalendarAlt
                      style={{ marginRight: "8px", color: "#198754" }}
                    />
                    Next Appointment:
                  </td>
                  <td style={{ padding: "10px", color: "#2c3e50" }}>
                    {prescription.notes
                      ? prescription.notes.includes("Next appointment:")
                        ? prescription.notes.replace("Next appointment: ", "")
                        : prescription.notes
                      : "Not Scheduled"}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Prescription;
