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
  FaTimesCircle,
  FaRedo,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const RejectedAppointments = () => {
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

    fetchRejectedAppointments(doctorId);
  }, [navigate]);

  const fetchRejectedAppointments = async (doctorId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/appointments?doctor_id=${doctorId}`,
      );

      // Filter rejected/canceled appointments
      const rejectedAppointments = res.data.filter((appt) => {
        return appt.status === "Rejected" || appt.status === "Cancelled";
      });

      const appointmentsWithPatients = await Promise.all(
        rejectedAppointments.map(async (appt) => {
          const patientId = appt.patient_id || appt.patientId;
          const patientRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/patients/${patientId}`,
          );

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
      toast.error("Failed to fetch rejected appointments");
      setLoading(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/appointments/${appointmentId}`,
        { status: "Confirmed" },
      );
      toast.success("Appointment reactivated successfully!");

      // Refresh the list
      const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
      fetchRejectedAppointments(doctorId);
    } catch (error) {
      console.error("Error reactivating appointment:", error);
      toast.error("Failed to reactivate appointment");
    }
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
        .reactivate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4) !important;
        }
      `}</style>

      <Card
        style={{
          border: "none",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(220, 53, 69, 0.15)",
          marginBottom: "30px",
          background: "linear-gradient(135deg, #dc3545, #c82333)",
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
              <FaTimesCircle style={{ fontSize: "28px" }} />
            </div>
            <div>
              <h3 style={{ margin: "0", fontWeight: "700" }}>
                Rejected & Cancelled Appointments
              </h3>
              <p
                style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "15px" }}
              >
                All rejected and cancelled appointments • {appointments.length}{" "}
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
          Loading rejected appointments...
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
            <FaTimesCircle
              style={{
                fontSize: "64px",
                color: "#dee2e6",
                marginBottom: "20px",
              }}
            />
            <h4 style={{ color: "#6c757d", marginBottom: "10px" }}>
              No Rejected Appointments
            </h4>
            <p style={{ color: "#adb5bd", marginBottom: "0" }}>
              Rejected or cancelled appointments will appear here.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Card
          className="appointment-card"
          style={{
            border: "none",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
              padding: "20px 25px",
              borderBottom: "2px solid #dee2e6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5
                style={{
                  margin: "0",
                  fontWeight: "700",
                  color: "#2c3e50",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaTimesCircle style={{ color: "#dc3545" }} />
                Appointment History
              </h5>
              <Badge
                bg="secondary"
                style={{
                  padding: "8px 15px",
                  fontSize: "14px",
                  borderRadius: "8px",
                }}
              >
                {filteredAppointments.length} Appointments
              </Badge>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <Table
              hover
              responsive
              style={{ marginBottom: "0", fontSize: "15px" }}
            >
              <thead
                style={{
                  background: "#f8f9fa",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    <FaUserInjured style={{ marginRight: "8px" }} />
                    Patient Details
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    <FaCalendarAlt style={{ marginRight: "8px" }} />
                    Date & Time
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      color: "#495057",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "15px",
                      fontWeight: "600",
                      color: "#495057",
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
                    style={{
                      borderBottom: "1px solid #f1f3f5",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8f9fa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "18px",
                        fontWeight: "600",
                        color: "#6c757d",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td style={{ padding: "18px" }}>
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#2c3e50",
                            marginBottom: "5px",
                          }}
                        >
                          {appt.patientName}
                        </div>
                        <div style={{ fontSize: "13px", color: "#6c757d" }}>
                          <FaPhone
                            style={{
                              fontSize: "11px",
                              marginRight: "6px",
                              color: "#0d6efd",
                            }}
                          />
                          {appt.patientPhone}
                        </div>
                        <div style={{ fontSize: "13px", color: "#6c757d" }}>
                          <MdEmail
                            style={{
                              fontSize: "13px",
                              marginRight: "6px",
                              color: "#6c757d",
                            }}
                          />
                          {appt.patientEmail}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "18px" }}>
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#2c3e50",
                            marginBottom: "5px",
                          }}
                        >
                          <FaCalendarAlt
                            style={{
                              marginRight: "8px",
                              color: "#fd7e14",
                            }}
                          />
                          {moment(appt.date).format("MMM DD, YYYY")}
                        </div>
                        <div style={{ fontSize: "13px", color: "#6c757d" }}>
                          <FaClock
                            style={{
                              marginRight: "6px",
                              color: "#17a2b8",
                            }}
                          />
                          {appt.slot}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "18px" }}>
                      <Badge
                        bg={appt.status === "Rejected" ? "danger" : "secondary"}
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          borderRadius: "8px",
                          fontWeight: "600",
                        }}
                      >
                        {appt.status}
                      </Badge>
                    </td>
                    <td
                      style={{
                        padding: "18px",
                        textAlign: "center",
                      }}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAccept(appt.id)}
                        className="reactivate-btn"
                        style={{
                          borderRadius: "8px",
                          padding: "8px 15px",
                          fontWeight: "600",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          border: "none",
                          background:
                            "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <FaRedo style={{ fontSize: "12px" }} />
                        Reactivate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RejectedAppointments;
