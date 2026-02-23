import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Table, Form, Modal, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaCalendarAlt,
  FaSearch,
  FaFilePdf,
  FaUserMd,
  FaUser,
  FaTimes,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdEventNote } from "react-icons/md";

const AdminViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Convert YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/appointments`,
        );

        const appointmentsWithDetails = await Promise.all(
          res.data.map(async (appt) => {
            try {
              const patientRes = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/patients/${appt.patient_id}`,
              );
              const doctorRes = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/doctors/${appt.doctor_id}`,
              );
              const paymentRes = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/payments?appointment_id=${appt.id}`,
              );

              // Check if payment data exists
              const paymentData =
                paymentRes.data.length > 0
                  ? paymentRes.data[0]
                  : { razorpay_payment_id: "N/A", payment_method: "N/A" };

              return {
                ...appt,
                date: appt.appointment_date || appt.date,
                slot: appt.time_slot || appt.slot,
                patientName: patientRes.data.username,
                patientPhone: patientRes.data.phone,
                patientEmail: patientRes.data.email,
                doctorName: doctorRes.data.username,
                formattedDate: formatDate(appt.appointment_date || appt.date),
                razorpayId:
                  paymentData.razorpay_payment_id ||
                  paymentData.razorpayId ||
                  "N/A",
                paymentMethod:
                  paymentData.payment_method ||
                  paymentData.paymentMethod ||
                  "N/A",
                createdAt: appt.created_at,
              };
            } catch (err) {
              console.error("Error fetching details:", err);
              return {
                ...appt,
                date: appt.appointment_date || appt.date,
                slot: appt.time_slot || appt.slot,
                patientName: "Unknown",
                doctorName: "Unknown",
                patientPhone: "-",
                patientEmail: "-",
                formattedDate: formatDate(appt.appointment_date || appt.date),
                razorpayId: "N/A",
                paymentMethod: "N/A",
                createdAt: appt.created_at,
              };
            }
          }),
        );

        // Sort by creation date (newest first)
        const sortedAppointments = appointmentsWithDetails.sort((a, b) => {
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
  }, []);

  // Cancel appointment
  const cancelAppointment = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/appointments/${id}`, {
        status: "Cancelled",
      });
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "Cancelled" } : appt,
        ),
      );
      toast.success("Appointment canceled successfully!");
    } catch (err) {
      console.error("Error canceling appointment:", err);
      toast.error("Failed to cancel appointment.");
    }
  };

  // View appointment details
  const viewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const styles = {
      Pending: {
        bg: "linear-gradient(135deg, #ffc107, #ff9800)",
        text: "Pending",
      },
      Confirmed: {
        bg: "linear-gradient(135deg, #0dcaf0, #0d6efd)",
        text: "Confirmed",
      },
      Completed: {
        bg: "linear-gradient(135deg, #198754, #20c997)",
        text: "Completed",
      },
      Cancelled: {
        bg: "linear-gradient(135deg, #dc3545, #c82333)",
        text: "Cancelled",
      },
      Rejected: {
        bg: "linear-gradient(135deg, #6c757d, #495057)",
        text: "Rejected",
      },
    };
    return styles[status] || styles.Pending;
  };

  // Filter Appointments based on search query & date
  const filteredAppointments = appointments.filter((appt) => {
    return (
      (appt.id.toString().includes(searchQuery) ||
        appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.patientName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (searchDate ? appt.date === formatDate(searchDate) : true)
    );
  });

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Doctor Appointments Report", 14, 10);

    const tableColumn = [
      "App.ID",
      "Patient",
      "Doctor",
      "Date",
      "Time Slot",
      "Payment Method",
      "Payment ID",
      "Status",
    ];
    const tableRows = [];

    filteredAppointments.forEach((appt) => {
      const rowData = [
        appt.id,
        appt.patientName,
        `Dr. ${appt.doctorName}`,
        appt.formattedDate,
        appt.slot,
        appt.paymentMethod,
        appt.razorpayId,
        appt.status || "Pending",
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });

    doc.save("Appointments_Report.pdf");
  };

  return (
    <div className="container mt-4">
      <div
        style={{
          background: "linear-gradient(135deg, #6f42c1, #9d7bd8)",
          padding: "25px",
          borderRadius: "15px",
          marginBottom: "30px",
          boxShadow: "0 4px 15px rgba(111, 66, 193, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <FaCalendarAlt style={{ fontSize: "28px", color: "white" }} />
          </div>
          <h3 style={{ margin: 0, color: "white", fontWeight: "700" }}>
            Appointment Management
          </h3>
        </div>
      </div>

      <Card
        className="p-4"
        style={{
          border: "none",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          borderRadius: "15px",
        }}
      >
        <div className="d-flex gap-2 mb-3">
          <div style={{ position: "relative", flex: 1 }}>
            <FaSearch
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6c757d",
                zIndex: 1,
              }}
            />
            <Form.Control
              type="text"
              placeholder="Search by ID, Doctor Name, or Patient Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: "40px",
                borderRadius: "10px",
                border: "2px solid #e9ecef",
              }}
            />
          </div>
          <Form.Control
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{
              borderRadius: "10px",
              border: "2px solid #e9ecef",
              maxWidth: "200px",
            }}
          />
          <Button
            onClick={generatePDF}
            style={{
              background: "linear-gradient(135deg, #198754, #20c997)",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            <FaFilePdf /> Download PDF
          </Button>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #9d7bd8)",
                    color: "white",
                  }}
                >
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    App.ID
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    Patient
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    Doctor
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    Contact
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
                    Appointment
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      border: "none",
                    }}
                  >
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
                    Status
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
                {filteredAppointments.map((appt) => (
                  <tr
                    key={appt.id}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <td
                      style={{
                        padding: "15px",
                        verticalAlign: "middle",
                        fontWeight: "600",
                        color: "#6f42c1",
                      }}
                    >
                      #{appt.id}
                    </td>
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
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #0dcaf0, #0d6efd)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <FaUser style={{ fontSize: "14px" }} />
                        </div>
                        <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                          {appt.patientName}
                        </span>
                      </div>
                    </td>
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
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #6f42c1, #9d7bd8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <FaUserMd style={{ fontSize: "14px" }} />
                        </div>
                        <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                          Dr. {appt.doctorName}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        verticalAlign: "middle",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          marginBottom: "5px",
                        }}
                      >
                        <FaPhone
                          style={{ color: "#6f42c1", fontSize: "12px" }}
                        />
                        <span style={{ color: "#495057" }}>
                          {appt.patientPhone}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FaEnvelope
                          style={{ color: "#6f42c1", fontSize: "12px" }}
                        />
                        <small style={{ color: "#6c757d" }}>
                          {appt.patientEmail}
                        </small>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        verticalAlign: "middle",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                          color: "#2c3e50",
                          marginBottom: "5px",
                        }}
                      >
                        {appt.date}
                      </div>
                      <small style={{ color: "#6c757d" }}>{appt.slot}</small>
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        verticalAlign: "middle",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          marginBottom: "5px",
                        }}
                      >
                        <FaMoneyBillWave
                          style={{ color: "#198754", fontSize: "12px" }}
                        />
                        <span style={{ fontWeight: "600", color: "#2c3e50" }}>
                          {appt.paymentMethod}
                        </span>
                      </div>
                      <small
                        style={{ color: "#6c757d", fontFamily: "monospace" }}
                      >
                        {appt.razorpayId && appt.razorpayId !== "N/A"
                          ? appt.razorpayId.substring(0, 20) + "..."
                          : "N/A"}
                      </small>
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: getStatusBadge(appt.status).bg,
                          color: "white",
                          display: "inline-block",
                        }}
                      >
                        {getStatusBadge(appt.status).text}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          onClick={() => viewDetails(appt)}
                          style={{
                            background:
                              "linear-gradient(135deg, #0dcaf0, #0d6efd)",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform =
                              "translateY(-2px)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "translateY(0)")
                          }
                        >
                          {" "}
                          <FaEye /> View
                        </Button>
                        {appt.status === "Cancelled" ||
                        appt.status === "Completed" ? (
                          <Button
                            disabled
                            style={{
                              background: "#6c757d",
                              border: "none",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "600",
                              opacity: 0.6,
                            }}
                          >
                            {appt.status === "Cancelled"
                              ? "Cancelled"
                              : "Completed"}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => cancelAppointment(appt.id)}
                            style={{
                              background:
                                "linear-gradient(135deg, #dc3545, #c82333)",
                              border: "none",
                              padding: "8px 14px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-2px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          >
                            <FaTimes /> Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6c757d" }}
          >
            <MdEventNote
              style={{ fontSize: "50px", marginBottom: "15px", opacity: 0.5 }}
            />
            <p style={{ margin: 0, fontSize: "16px" }}>
              No appointments found.
            </p>
          </div>
        )}
      </Card>

      {/* Appointment Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #6f42c1, #9d7bd8)",
            color: "white",
            border: "none",
          }}
        >
          <Modal.Title
            style={{
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaCalendarAlt /> Appointment Details #{selectedAppointment?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "25px", background: "#f8f9fa" }}>
          {selectedAppointment && (
            <div>
              {/* Patient & Doctor Info */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <Card
                  style={{
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <Card.Body>
                    <h6
                      style={{
                        marginBottom: "15px",
                        color: "#6f42c1",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaUser /> Patient Information
                    </h6>
                    <div style={{ fontSize: "14px", lineHeight: "2" }}>
                      <div>
                        <strong>Name:</strong> {selectedAppointment.patientName}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FaPhone style={{ color: "#6f42c1" }} />
                        <span>{selectedAppointment.patientPhone}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <FaEnvelope style={{ color: "#6f42c1" }} />
                        <small>{selectedAppointment.patientEmail}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card
                  style={{
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <Card.Body>
                    <h6
                      style={{
                        marginBottom: "15px",
                        color: "#6f42c1",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaUserMd /> Doctor Information
                    </h6>
                    <div style={{ fontSize: "14px", lineHeight: "2" }}>
                      <div>
                        <strong>Name:</strong> Dr.{" "}
                        {selectedAppointment.doctorName}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>

              {/* Appointment Details */}
              <Card
                style={{
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  marginBottom: "20px",
                }}
              >
                <Card.Body>
                  <h6
                    style={{
                      marginBottom: "15px",
                      color: "#6f42c1",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaCalendarAlt /> Appointment Details
                  </h6>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      fontSize: "14px",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#495057" }}>Date:</strong>
                      <div style={{ color: "#212529", marginTop: "5px" }}>
                        {selectedAppointment.date}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "#495057" }}>Time Slot:</strong>
                      <div style={{ color: "#212529", marginTop: "5px" }}>
                        {selectedAppointment.slot}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "#495057" }}>Status:</strong>
                      <div style={{ marginTop: "5px" }}>
                        <Badge
                          style={{
                            background: getStatusBadge(
                              selectedAppointment.status,
                            ).bg,
                            padding: "6px 12px",
                            fontSize: "12px",
                          }}
                        >
                          {getStatusBadge(selectedAppointment.status).text}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "#495057" }}>
                        Disease/Concern:
                      </strong>
                      <div style={{ color: "#212529", marginTop: "5px" }}>
                        {selectedAppointment.disease || "Not specified"}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Payment Information */}
              <Card
                style={{
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Body>
                  <h6
                    style={{
                      marginBottom: "15px",
                      color: "#6f42c1",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaMoneyBillWave /> Payment Information
                  </h6>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      fontSize: "14px",
                    }}
                  >
                    <div>
                      <strong style={{ color: "#495057" }}>
                        Payment Method:
                      </strong>
                      <div style={{ color: "#212529", marginTop: "5px" }}>
                        {selectedAppointment.paymentMethod}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: "#495057" }}>
                        Transaction ID:
                      </strong>
                      <div
                        style={{
                          color: "#6c757d",
                          fontSize: "13px",
                          fontFamily: "monospace",
                          marginTop: "5px",
                        }}
                      >
                        {selectedAppointment.razorpayId}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ border: "none", background: "#f8f9fa" }}>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
            style={{
              background: "#6c757d",
              border: "none",
              padding: "8px 20px",
              borderRadius: "8px",
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminViewAppointments;
