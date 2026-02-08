import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import moment from "moment";
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaStethoscope,
  FaClock,
  FaEye,
  FaCheck,
  FaTimes,
  FaPrescriptionBottleAlt,
  FaUserMd,
  FaStar,
  FaClipboardList,
} from "react-icons/fa";
import { MdDashboard, MdTrendingUp, MdPending } from "react-icons/md";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState(""); // Logged-in doctor ID
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState([]); // Initialize as an array
  const [confirmedAppointments, setConfirmedAppointments] = useState(0); // Confirmed appointments count
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [revenue, setRevenue] = useState(0); // Total revenue
  const [completedAppointments, setCompletedAppointments] = useState(0);

  useEffect(() => {
    const loggedInDoctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (loggedInDoctorId) {
      setDoctorId(loggedInDoctorId);
      fetchDashboardData(loggedInDoctorId);
    }
  }, []);

  const fetchDashboardData = async (doctorId) => {
    try {
      // Fetch all appointments for the doctor
      const totalAppointmentsResponse = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/appointments?doctor_id=${doctorId}`,
      );
      const allAppointments = totalAppointmentsResponse.data;
      setTotalAppointments(allAppointments);

      // Filter today's appointments
      const today = moment().format("YYYY-MM-DD");
      const todayAppts = allAppointments.filter((appt) => {
        const apptDate = moment(appt.appointment_date).format("YYYY-MM-DD");
        return apptDate === today;
      });

      // Fetch patient details for today's appointments
      const todayWithPatients = await Promise.all(
        todayAppts.map(async (appt) => {
          try {
            const patientRes = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/patients/${appt.patient_id}`,
            );
            return {
              ...appt,
              patientName: patientRes.data.username,
              patientPhone: patientRes.data.phone,
            };
          } catch (error) {
            return { ...appt, patientName: "Unknown", patientPhone: "-" };
          }
        }),
      );
      setTodayAppointments(todayWithPatients);

      // Filter pending appointments
      const pending = allAppointments.filter(
        (appt) => appt.status === "Pending",
      );
      const pendingWithPatients = await Promise.all(
        pending.slice(0, 5).map(async (appt) => {
          try {
            const patientRes = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/patients/${appt.patient_id}`,
            );
            return {
              ...appt,
              patientName: patientRes.data.username,
              patientPhone: patientRes.data.phone,
            };
          } catch (error) {
            return { ...appt, patientName: "Unknown", patientPhone: "-" };
          }
        }),
      );
      setPendingAppointments(pendingWithPatients);

      // Filter upcoming appointments (future dates, confirmed)
      const upcoming = allAppointments
        .filter((appt) => {
          const apptDate = moment(appt.appointment_date);
          return (
            apptDate.isAfter(moment(), "day") && appt.status === "Confirmed"
          );
        })
        .sort(
          (a, b) => new Date(a.appointment_date) - new Date(b.appointment_date),
        )
        .slice(0, 5);

      const upcomingWithPatients = await Promise.all(
        upcoming.map(async (appt) => {
          try {
            const patientRes = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/patients/${appt.patient_id}`,
            );
            return {
              ...appt,
              patientName: patientRes.data.username,
            };
          } catch (error) {
            return { ...appt, patientName: "Unknown" };
          }
        }),
      );
      setUpcomingAppointments(upcomingWithPatients);

      // Fetch total patients (only those with "Confirmed" appointments)
      const acceptedAppointments = allAppointments.filter(
        (appointment) => appointment.status === "Confirmed",
      );
      setConfirmedAppointments(acceptedAppointments.length);

      // Count completed appointments
      const completed = allAppointments.filter(
        (appt) => appt.status === "Completed",
      );
      setCompletedAppointments(completed.length);

      // Get unique patients with their latest appointment
      const patientMap = new Map();
      acceptedAppointments
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .forEach((appt) => {
          if (!patientMap.has(appt.patient_id)) {
            patientMap.set(appt.patient_id, appt);
          }
        });

      setTotalPatients(patientMap.size);

      // Fetch recent patients (last 5 unique patients with confirmed appointments)
      const recentPatientIds = Array.from(patientMap.keys()).slice(0, 5);
      const recentPatientsData = await Promise.all(
        recentPatientIds.map(async (patientId) => {
          try {
            const patientRes = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/patients/${patientId}`,
            );
            const appt = patientMap.get(patientId);
            return {
              ...patientRes.data,
              lastVisit: appt.appointment_date,
            };
          } catch (error) {
            return null;
          }
        }),
      );
      setRecentPatients(recentPatientsData.filter((p) => p !== null));

      // Calculate total revenue from payments
      try {
        const paymentsResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/payments?doctor_id=${doctorId}`,
        );
        const totalRevenue = paymentsResponse.data.reduce((sum, payment) => {
          const amount = parseFloat(payment.amount);
          if (!isNaN(amount)) {
            return sum + amount;
          }
          return sum;
        }, 0);
        setRevenue(totalRevenue);
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setRevenue(0);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="container mt-4">
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
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .stat-card {
          animation: fadeInUp 0.6s ease-out;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
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
            <MdDashboard style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h2 style={{ margin: "0", fontWeight: "700", fontSize: "28px" }}>
              Doctor Dashboard
            </h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "15px" }}>
              Your practice overview and statistics
            </p>
          </div>
        </div>
      </div>

      <Row className="mt-4">
        {/* Today's Appointments */}
        <Col md={3} className="mb-4">
          <Card
            className="stat-card"
            style={{
              border: "none",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  marginBottom: "10px",
                }}
              >
                <FaCalendarCheck style={{ fontSize: "28px", color: "white" }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: "center", padding: "20px" }}>
              <Card.Title
                style={{
                  color: "#6c757d",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Today's Appointments
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#0d6efd",
                  margin: "0",
                }}
              >
                {todayAppointments.length}
              </Card.Text>
              <Card.Text
                style={{
                  fontSize: "13px",
                  color: "#6c757d",
                  marginTop: "8px",
                  fontWeight: "500",
                }}
              >
                Scheduled for today
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Appointments */}
        <Col md={3} className="mb-4">
          <Card
            className="stat-card"
            style={{
              border: "none",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #6f42c1, #9d7bd8)",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  marginBottom: "10px",
                }}
              >
                <FaCalendarAlt style={{ fontSize: "28px", color: "white" }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: "center", padding: "20px" }}>
              <Card.Title
                style={{
                  color: "#6c757d",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Total Appointments
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#6f42c1",
                  margin: "0",
                }}
              >
                {totalAppointments.length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Patients with Confirmed Appointments */}
        <Col md={3} className="mb-4">
          <Card
            className="stat-card"
            style={{
              border: "none",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #198754, #20c997)",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  marginBottom: "10px",
                }}
              >
                <FaUsers style={{ fontSize: "28px", color: "white" }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: "center", padding: "20px" }}>
              <Card.Title
                style={{
                  color: "#6c757d",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Total Patients
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#198754",
                  margin: "0",
                }}
              >
                {totalPatients}
              </Card.Text>
              <Card.Text
                style={{
                  fontSize: "13px",
                  color: "#6c757d",
                  marginTop: "8px",
                  fontWeight: "500",
                }}
              >
                {confirmedAppointments} Confirmed Appointments
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Revenue */}
        <Col md={3} className="mb-4">
          <Card
            className="stat-card"
            style={{
              border: "none",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #fd7e14, #ffc107)",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  marginBottom: "10px",
                }}
              >
                <FaMoneyBillWave style={{ fontSize: "28px", color: "white" }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: "center", padding: "20px" }}>
              <Card.Title
                style={{
                  color: "#6c757d",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Total Revenue
              </Card.Title>
              <Card.Text
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#fd7e14",
                  margin: "0",
                }}
              >
                ₹{revenue}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Bar */}
      <Card
        style={{
          border: "none",
          borderRadius: "15px",
          marginBottom: "30px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Card.Body style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h5
              style={{
                margin: 0,
                fontWeight: "700",
                color: "#2c3e50",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaClipboardList style={{ color: "#0d6efd" }} />
              Quick Actions
            </h5>
          </div>
          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <Button
              style={{
                background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => navigate("/doctor/ap")}
            >
              <FaEye /> View All Appointments
            </Button>
            <Button
              style={{
                background: "linear-gradient(135deg, #198754, #20c997)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => navigate("/doctor/setslot")}
            >
              <FaClock /> Set Availability Slots
            </Button>
            <Button
              style={{
                background: "linear-gradient(135deg, #6f42c1, #9d7bd8)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => navigate("/doctor/patient")}
            >
              <FaUsers /> View Patients
            </Button>
            <Button
              style={{
                background: "linear-gradient(135deg, #fd7e14, #ffc107)",
                border: "none",
                padding: "12px 24px",
                borderRadius: "10px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => navigate("/doctor/review")}
            >
              <FaStar /> View Reviews
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Row>
        {/* Status Breakdown Card */}
        <Col md={4} className="mb-4">
          <Card
            style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              height: "100%",
            }}
          >
            <Card.Body style={{ padding: "20px" }}>
              <h5
                style={{
                  fontWeight: "700",
                  color: "#2c3e50",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaStethoscope style={{ color: "#0d6efd" }} />
                Appointment Status
              </h5>
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#6c757d", fontSize: "14px" }}>
                    Pending
                  </span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#ffc107",
                      fontSize: "14px",
                    }}
                  >
                    {pendingAppointments.length}
                  </span>
                </div>
                <div
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "10px",
                    height: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#ffc107",
                      height: "100%",
                      width: `${totalAppointments.length > 0 ? (pendingAppointments.length / totalAppointments.length) * 100 : 0}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#6c757d", fontSize: "14px" }}>
                    Confirmed
                  </span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#198754",
                      fontSize: "14px",
                    }}
                  >
                    {confirmedAppointments}
                  </span>
                </div>
                <div
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "10px",
                    height: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#198754",
                      height: "100%",
                      width: `${totalAppointments.length > 0 ? (confirmedAppointments / totalAppointments.length) * 100 : 0}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#6c757d", fontSize: "14px" }}>
                    Completed
                  </span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#0d6efd",
                      fontSize: "14px",
                    }}
                  >
                    {completedAppointments}
                  </span>
                </div>
                <div
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "10px",
                    height: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "#0d6efd",
                      height: "100%",
                      width: `${totalAppointments.length > 0 ? (completedAppointments / totalAppointments.length) * 100 : 0}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Pending Appointments Section */}
        <Col md={8} className="mb-4">
          <Card
            style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              height: "100%",
            }}
          >
            <Card.Body style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    color: "#2c3e50",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <MdPending style={{ color: "#ffc107" }} />
                  Pending Approvals
                </h5>
                <Badge bg="warning" style={{ fontSize: "14px" }}>
                  {pendingAppointments.length} Pending
                </Badge>
              </div>
              {pendingAppointments.length > 0 ? (
                <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                  <Table hover style={{ marginBottom: 0 }}>
                    <thead style={{ background: "#f8f9fa" }}>
                      <tr>
                        <th style={{ fontSize: "13px", fontWeight: "600" }}>
                          Patient
                        </th>
                        <th style={{ fontSize: "13px", fontWeight: "600" }}>
                          Date
                        </th>
                        <th style={{ fontSize: "13px", fontWeight: "600" }}>
                          Time
                        </th>
                        <th
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            textAlign: "center",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAppointments.map((appt) => (
                        <tr key={appt.id}>
                          <td style={{ fontSize: "14px" }}>
                            {appt.patientName}
                          </td>
                          <td style={{ fontSize: "14px" }}>
                            {moment(appt.appointment_date).format("DD-MM-YYYY")}
                          </td>
                          <td style={{ fontSize: "14px" }}>
                            {appt.appointment_time}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Button
                              size="sm"
                              style={{
                                background: "#198754",
                                border: "none",
                                marginRight: "5px",
                                padding: "4px 12px",
                              }}
                              onClick={() => navigate("/doctor/ap")}
                            >
                              <FaCheck />
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              style={{
                                border: "none",
                                padding: "4px 12px",
                              }}
                              onClick={() => navigate("/doctor/ap")}
                            >
                              <FaTimes />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6c757d",
                  }}
                >
                  <MdPending
                    style={{ fontSize: "48px", marginBottom: "10px" }}
                  />
                  <p>No pending appointments</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Today's Appointments */}
        <Col md={6} className="mb-4">
          <Card
            style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card.Body style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    color: "#2c3e50",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FaCalendarCheck style={{ color: "#0d6efd" }} />
                  Today's Schedule
                </h5>
                <Badge bg="primary" style={{ fontSize: "14px" }}>
                  {todayAppointments.length} Total
                </Badge>
              </div>
              {todayAppointments.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {todayAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      style={{
                        background: "#f8f9fa",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "10px",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h6
                            style={{
                              margin: 0,
                              fontWeight: "600",
                              color: "#2c3e50",
                            }}
                          >
                            {appt.patientName}
                          </h6>
                          <p
                            style={{
                              margin: "5px 0 0 0",
                              fontSize: "13px",
                              color: "#6c757d",
                            }}
                          >
                            <FaClock
                              style={{ marginRight: "5px", fontSize: "12px" }}
                            />
                            {appt.appointment_time}
                          </p>
                        </div>
                        <Badge
                          bg={
                            appt.status === "Confirmed"
                              ? "success"
                              : appt.status === "Pending"
                                ? "warning"
                                : "secondary"
                          }
                        >
                          {appt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6c757d",
                  }}
                >
                  <FaCalendarCheck
                    style={{ fontSize: "48px", marginBottom: "10px" }}
                  />
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Appointments */}
        <Col md={6} className="mb-4">
          <Card
            style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card.Body style={{ padding: "20px" }}>
              <h5
                style={{
                  fontWeight: "700",
                  color: "#2c3e50",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaCalendarAlt style={{ color: "#6f42c1" }} />
                Upcoming Appointments
              </h5>
              {upcomingAppointments.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {upcomingAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      style={{
                        background: "#f8f9fa",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "10px",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h6
                            style={{
                              margin: 0,
                              fontWeight: "600",
                              color: "#2c3e50",
                            }}
                          >
                            {appt.patientName}
                          </h6>
                          <p
                            style={{
                              margin: "5px 0 0 0",
                              fontSize: "13px",
                              color: "#6c757d",
                            }}
                          >
                            <FaCalendarAlt
                              style={{ marginRight: "5px", fontSize: "12px" }}
                            />
                            {moment(appt.appointment_date).format(
                              "DD MMM YYYY",
                            )}{" "}
                            at {appt.appointment_time}
                          </p>
                        </div>
                        <Badge bg="success">Confirmed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6c757d",
                  }}
                >
                  <FaCalendarAlt
                    style={{ fontSize: "48px", marginBottom: "10px" }}
                  />
                  <p>No upcoming appointments</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Patients */}
      <Row>
        <Col md={12} className="mb-4">
          <Card
            style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Card.Body style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    fontWeight: "700",
                    color: "#2c3e50",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <FaUserMd style={{ color: "#198754" }} />
                  Recent Patients
                </h5>
                <Button
                  size="sm"
                  style={{
                    background: "linear-gradient(135deg, #198754, #20c997)",
                    border: "none",
                  }}
                  onClick={() => navigate("/doctor/patient")}
                >
                  View All
                </Button>
              </div>
              {recentPatients.length > 0 ? (
                <Table hover responsive>
                  <thead style={{ background: "#f8f9fa" }}>
                    <tr>
                      <th style={{ fontSize: "13px", fontWeight: "600" }}>
                        Patient Name
                      </th>
                      <th style={{ fontSize: "13px", fontWeight: "600" }}>
                        Email
                      </th>
                      <th style={{ fontSize: "13px", fontWeight: "600" }}>
                        Phone
                      </th>
                      <th style={{ fontSize: "13px", fontWeight: "600" }}>
                        Last Visit
                      </th>
                      <th
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td
                          style={{ fontSize: "14px", verticalAlign: "middle" }}
                        >
                          {patient.username}
                        </td>
                        <td
                          style={{ fontSize: "14px", verticalAlign: "middle" }}
                        >
                          {patient.email}
                        </td>
                        <td
                          style={{ fontSize: "14px", verticalAlign: "middle" }}
                        >
                          {patient.phone}
                        </td>
                        <td
                          style={{ fontSize: "14px", verticalAlign: "middle" }}
                        >
                          {moment(patient.lastVisit).format("DD-MM-YYYY")}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <Button
                            size="sm"
                            style={{
                              background: "#0d6efd",
                              border: "none",
                              padding: "4px 12px",
                            }}
                            onClick={() => navigate("/doctor/patient")}
                          >
                            <FaEye style={{ marginRight: "5px" }} />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6c757d",
                  }}
                >
                  <FaUsers style={{ fontSize: "48px", marginBottom: "10px" }} />
                  <p>No recent patients</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Table for Appointments */}
    </div>
  );
};

export default DoctorDashboard;
