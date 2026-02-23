import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Card, Button, Table, Badge, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";
import {
  FaUserInjured,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaPrescriptionBottleAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const CompletedAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (!doctorId) {
      navigate("/login");
      return;
    }

    fetchCompletedAppointments(doctorId);
  }, [navigate]);

  const fetchCompletedAppointments = async (doctorId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/appointments?doctor_id=${doctorId}`,
      );

      // Filter completed appointments
      const completedAppointments = res.data.filter((appt) => {
        return appt.status === "Completed";
      });

      const appointmentsWithPatients = await Promise.all(
        completedAppointments.map(async (appt) => {
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

      // Sort by date (most recent first)
      const sortedAppointments = appointmentsWithPatients.sort((a, b) => {
        const dateA = moment(a.date);
        const dateB = moment(b.date);
        return dateB.diff(dateA);
      });

      setAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to fetch completed appointments");
      setLoading(false);
    }
  };

  const handleViewPrescription = (appointmentId) => {
    navigate(`/doctor/prescription/${appointmentId}`);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredAppointments(appointments);
      return;
    }
    const filtered = appointments.filter(
      (appt) =>
        appt.patientName.toLowerCase().includes(value.toLowerCase()) ||
        appt.patientPhone.includes(value),
    );
    setFilteredAppointments(filtered);
  };

  return (
    <div className="container-fluid mt-4">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .appointment-card {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>

      <Card
        style={{
          border: "none",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(25, 135, 84, 0.15)",
          marginBottom: "30px",
          background: "linear-gradient(135deg, #198754, #20c997)",
          color: "white",
        }}
      >
        <Card.Body style={{ padding: "30px" }}>
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
              <FaCheckCircle style={{ fontSize: "28px" }} />
            </div>
            <div>
              <h3 style={{ margin: "0", fontWeight: "700" }}>
                Completed Appointments
              </h3>
              <p
                style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "15px" }}
              >
                All successfully completed appointments • {appointments.length}{" "}
                total
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Search Filter */}
      <Card
        style={{
          border: "none",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          marginBottom: "25px",
        }}
      >
        <Card.Body style={{ padding: "20px" }}>
          <Form.Group>
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#2c3e50",
                marginBottom: "10px",
              }}
            >
              🔍 Search Appointments
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by patient name or phone number..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                borderRadius: "10px",
                border: "2px solid #e0e0e0",
                padding: "12px 15px",
                fontSize: "15px",
                transition: "all 0.3s ease",
              }}
            />
          </Form.Group>
        </Card.Body>
      </Card>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#6c757d",
            fontSize: "18px",
          }}
        >
          Loading completed appointments...
        </div>
      ) : appointments.length === 0 ? (
        <Card
          style={{
            border: "none",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Card.Body style={{ padding: "60px", textAlign: "center" }}>
            <FaCheckCircle
              style={{
                fontSize: "64px",
                color: "#dee2e6",
                marginBottom: "20px",
              }}
            />
            <h4 style={{ color: "#6c757d", marginBottom: "10px" }}>
              No Completed Appointments
            </h4>
            <p style={{ color: "#adb5bd", marginBottom: "0" }}>
              Completed appointments will appear here after prescription is
              written.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <Table
            hover
            responsive
            style={{
              background: "white",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead
              style={{
                background: "linear-gradient(135deg, #198754, #20c997)",
                color: "white",
              }}
            >
              <tr>
                <th style={{ padding: "18px", fontWeight: "600" }}>Date</th>
                <th style={{ padding: "18px", fontWeight: "600" }}>Time</th>
                <th style={{ padding: "18px", fontWeight: "600" }}>
                  Patient Info
                </th>
                <th style={{ padding: "18px", fontWeight: "600" }}>Contact</th>
                <th style={{ padding: "18px", fontWeight: "600" }}>Payment</th>
                <th style={{ padding: "18px", fontWeight: "600" }}>Status</th>
                <th
                  style={{
                    padding: "18px",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt, index) => (
                <tr
                  key={appt.id}
                  className="appointment-card"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    borderBottom: "1px solid #e9ecef",
                  }}
                >
                  <td style={{ padding: "18px", verticalAlign: "middle" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <FaCalendarAlt
                        style={{ color: "#198754", fontSize: "18px" }}
                      />
                      <span style={{ fontWeight: "600", fontSize: "15px" }}>
                        {moment(appt.date).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "18px", verticalAlign: "middle" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <FaClock style={{ color: "#0d6efd", fontSize: "18px" }} />
                      <span style={{ fontWeight: "600", fontSize: "15px" }}>
                        {moment(appt.slot, "HH:mm:ss").format("hh:mm A")}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "18px", verticalAlign: "middle" }}>
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#2c3e50",
                          fontSize: "15px",
                          marginBottom: "4px",
                        }}
                      >
                        <FaUserInjured
                          style={{
                            color: "#0d6efd",
                            marginRight: "8px",
                            fontSize: "16px",
                          }}
                        />
                        {appt.patientName}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "18px", verticalAlign: "middle" }}>
                    <div style={{ fontSize: "14px" }}>
                      <div style={{ marginBottom: "5px" }}>
                        <FaPhone
                          style={{
                            color: "#198754",
                            marginRight: "8px",
                            fontSize: "12px",
                          }}
                        />
                        {appt.patientPhone}
                      </div>
                      <div style={{ color: "#6c757d" }}>
                        <MdEmail
                          style={{
                            color: "#0d6efd",
                            marginRight: "8px",
                            fontSize: "14px",
                          }}
                        />
                        {appt.patientEmail}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "18px", verticalAlign: "middle" }}>
                    <div style={{ fontSize: "14px" }}>
                      <div style={{ marginBottom: "5px", fontWeight: "500" }}>
                        <FaMoneyBillWave
                          style={{
                            color: "#fd7e14",
                            marginRight: "8px",
                            fontSize: "14px",
                          }}
                        />
                        {appt.paymentMethod}
                      </div>
                      {appt.razorpayId !== "-" && (
                        <div style={{ fontSize: "12px", color: "#6c757d" }}>
                          ID: {appt.razorpayId}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "18px", verticalAlign: "middle" }}>
                    <Badge
                      bg="success"
                      style={{
                        fontSize: "13px",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "600",
                      }}
                    >
                      <FaCheckCircle style={{ marginRight: "6px" }} />
                      Completed
                    </Badge>
                  </td>
                  <td style={{ padding: "18px", verticalAlign: "middle" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        style={{
                          background:
                            "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "13px",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        onClick={() => handleViewPrescription(appt.id)}
                      >
                        <FaPrescriptionBottleAlt style={{ fontSize: "12px" }} />
                        View Prescription
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CompletedAppointments;
