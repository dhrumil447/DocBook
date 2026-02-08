import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, Button, Nav, Badge, Modal, Form } from "react-bootstrap";
import {
  FaUserEdit,
  FaTrash,
  FaSignOutAlt,
  FaCalendarCheck,
  FaStar,
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaPhone,
  FaEnvelope,
  FaUserMd,
  FaHospital,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";

const PatientProfile = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState({
    recent: [],
    past: [],
    older: [],
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [reviewedAppointments, setReviewedAppointments] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const patientData = JSON.parse(sessionStorage.getItem("DocBook"));
    if (!patientData?.id) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [patientRes, appointmentsRes, reviewsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BASE_URL}/patients/${patientData.id}`,
          ),
          axios.get(
            `${import.meta.env.VITE_BASE_URL}/appointments?patient_id=${patientData.id}`,
          ),
          axios.get(
            `${import.meta.env.VITE_BASE_URL}/reviews?patientId=${patientData.id}`,
          ),
        ]);

        setPatient(patientRes.data);

        const reviewedMap = {};
        reviewsRes.data.forEach((review) => {
          reviewedMap[review.appointmentId] = true;
        });
        setReviewedAppointments(reviewedMap);

        const appointmentsWithDoctors = await Promise.all(
          appointmentsRes.data.map(async (appointment) => {
            try {
              const doctorId = appointment.doctor_id || appointment.doctorId;
              const doctorRes = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/doctors/${doctorId}`,
              );

              // Parse appointment_date from backend (YYYY-MM-DD format)
              const appointmentDate =
                appointment.appointment_date || appointment.date;
              const appointmentTime =
                appointment.appointment_time || appointment.slot;

              return {
                ...appointment,
                id: appointment.id,
                doctorId: doctorId,
                date: appointmentDate,
                slot: appointmentTime,
                status: appointment.status,
                doctor: doctorRes.data,
                convertedDate: new Date(appointmentDate),
              };
            } catch (error) {
              console.error("Error fetching doctor details:", error);
              return {
                ...appointment,
                doctor: {
                  username: "Unknown",
                  specialization: "Unknown",
                  clinicName: "N/A",
                  clinicAddress: "N/A",
                },
                convertedDate: new Date(),
              };
            }
          }),
        );

        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

        // Separate upcoming (future + pending/confirmed) from past appointments
        const upcomingAppointments = appointmentsWithDoctors
          .filter((app) => {
            const isPending = app.status === "Pending";
            const isAccepted = app.status === "Confirmed";
            const isFuture = app.convertedDate >= new Date();
            return isPending || isAccepted || isFuture;
          })
          .sort((a, b) => a.convertedDate - b.convertedDate); // Sort by date ascending

        setAppointments({
          recent: upcomingAppointments,
          past: appointmentsWithDoctors.filter(
            (app) =>
              app.convertedDate < oneWeekAgo &&
              app.convertedDate >= oneMonthAgo &&
              !upcomingAppointments.includes(app),
          ),
          older: appointmentsWithDoctors.filter(
            (app) =>
              app.convertedDate < oneMonthAgo &&
              !upcomingAppointments.includes(app),
          ),
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const reviewData = {
      doctorId: selectedAppointment.doctorId,
      patientId: patient.id,
      appointmentId: selectedAppointment.id,
      rating,
      comment,
      status: "Pending",
      date: new Date().toISOString(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/reviews`, reviewData);
      setReviewedAppointments((prev) => ({
        ...prev,
        [selectedAppointment.id]: true,
      }));
      setShowReviewModal(false);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const renderAppointments = (appointmentsList = [], title) => (
    <div className="mb-4">
      <h5
        className="fw-bold mt-4"
        style={{
          color: "#2c3e50",
          borderBottom: "2px solid #0d6efd",
          paddingBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaCalendarCheck style={{ color: "#0d6efd" }} />
        {title}
      </h5>
      {appointmentsList.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            color: "#6c757d",
            marginTop: "20px",
          }}
        >
          <FaCalendarAlt
            style={{ fontSize: "48px", color: "#dee2e6", marginBottom: "15px" }}
          />
          <p className="mb-0">No {title.toLowerCase()} found.</p>
        </div>
      ) : (
        appointmentsList.map((appointment) => (
          <Card
            key={appointment.id}
            className="mb-3 border-0"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FaUserMd style={{ fontSize: "24px", color: "white" }} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>
                        Dr. {appointment.doctor.username}
                      </h5>
                      <p
                        className="mb-0"
                        style={{ fontSize: "14px", color: "#6c757d" }}
                      >
                        {appointment.doctor.specialization}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
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
                      <FaHospital
                        style={{ color: "#0d6efd", fontSize: "16px" }}
                      />
                      <div>
                        <p
                          className="mb-0"
                          style={{ fontSize: "12px", color: "#6c757d" }}
                        >
                          Clinic
                        </p>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          {appointment.doctor.clinicName}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaCalendarAlt
                        style={{ color: "#198754", fontSize: "16px" }}
                      />
                      <div>
                        <p
                          className="mb-0"
                          style={{ fontSize: "12px", color: "#6c757d" }}
                        >
                          Date
                        </p>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          {appointment.date}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaClock style={{ color: "#fd7e14", fontSize: "16px" }} />
                      <div>
                        <p
                          className="mb-0"
                          style={{ fontSize: "12px", color: "#6c757d" }}
                        >
                          Time
                        </p>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          {appointment.slot}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FaMapMarkerAlt
                        style={{ color: "#dc3545", fontSize: "16px" }}
                      />
                      <div>
                        <p
                          className="mb-0"
                          style={{ fontSize: "12px", color: "#6c757d" }}
                        >
                          Address
                        </p>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#2c3e50",
                          }}
                        >
                          {appointment.doctor.clinicAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {appointment.status === "Confirmed" && (
                    <Button
                      variant={
                        reviewedAppointments[appointment.id]
                          ? "secondary"
                          : "primary"
                      }
                      size="sm"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowReviewModal(true);
                      }}
                      disabled={reviewedAppointments[appointment.id]}
                      style={{
                        borderRadius: "8px",
                        fontWeight: "600",
                        padding: "8px 20px",
                        border: "none",
                        background: reviewedAppointments[appointment.id]
                          ? "#6c757d"
                          : "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                      }}
                    >
                      {reviewedAppointments[appointment.id] ? (
                        <>
                          <FaStar className="me-2" />
                          Reviewed
                        </>
                      ) : (
                        <>
                          <FaStar className="me-2" />
                          Give Review
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <Badge
                  bg={
                    appointment.status === "Confirmed"
                      ? "success"
                      : appointment.status === "Pending"
                        ? "warning"
                        : "danger"
                  }
                  style={{
                    fontSize: "14px",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    boxShadow:
                      appointment.status === "Confirmed"
                        ? "0 4px 12px rgba(25, 135, 84, 0.3)"
                        : appointment.status === "Pending"
                          ? "0 4px 12px rgba(255, 193, 7, 0.3)"
                          : "0 4px 12px rgba(220, 53, 69, 0.3)",
                  }}
                >
                  {appointment.status === "Confirmed" && "✓ Confirmed"}
                  {appointment.status === "Pending" && "⏳ Pending"}
                  {appointment.status !== "Confirmed" &&
                    appointment.status !== "Pending" &&
                    appointment.status}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Card
          className="border-0 shadow-lg"
          style={{ borderRadius: "20px", overflow: "hidden" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
              padding: "30px",
              color: "white",
            }}
          >
            <h3 className="fw-bold mb-0">My Profile</h3>
          </div>

          <Card.Body className="p-0">
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={setActiveTab}
              className="border-bottom"
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="profile"
                  style={{
                    fontWeight: activeTab === "profile" ? "600" : "400",
                    color: activeTab === "profile" ? "#0d6efd" : "#6c757d",
                    borderBottom:
                      activeTab === "profile" ? "3px solid #0d6efd" : "none",
                  }}
                >
                  <FaUserEdit className="me-2" />
                  Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="appointments"
                  style={{
                    fontWeight: activeTab === "appointments" ? "600" : "400",
                    color: activeTab === "appointments" ? "#0d6efd" : "#6c757d",
                    borderBottom:
                      activeTab === "appointments"
                        ? "3px solid #0d6efd"
                        : "none",
                  }}
                >
                  <FaCalendarCheck className="me-2" />
                  My Appointments
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <div className="p-4">
              {activeTab === "profile" && patient && (
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                  {/* User Avatar Section */}
                  <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <div
                      style={{
                        width: "140px",
                        height: "140px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 8px 30px rgba(13, 110, 253, 0.4)",
                        border: "5px solid white",
                      }}
                    >
                      <FaUser style={{ fontSize: "70px", color: "white" }} />
                    </div>
                    <h4
                      className="fw-bold"
                      style={{ color: "#2c3e50", marginBottom: "5px" }}
                    >
                      {patient.username}
                    </h4>
                    <p style={{ color: "#6c757d", fontSize: "14px" }}>
                      Patient ID: #{patient.id}
                    </p>
                  </div>

                  {/* Profile Information Cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "25px",
                    }}
                  >
                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        background: "white",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #fd7e1422 0%, #ffa94d44 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FaBirthdayCake
                          style={{ fontSize: "22px", color: "#fd7e14" }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#6c757d",
                            fontWeight: "500",
                          }}
                        >
                          Age
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                          }}
                        >
                          {patient.age} years
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        background: "white",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #d6338422 0%, #f0849744 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FaVenusMars
                          style={{ fontSize: "22px", color: "#d63384" }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#6c757d",
                            fontWeight: "500",
                          }}
                        >
                          Gender
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                          }}
                        >
                          {patient.gender}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        background: "white",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        transition: "all 0.3s ease",
                        gridColumn: "span 2",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #19875422 0%, #20c99744 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FaPhone
                          style={{ fontSize: "22px", color: "#198754" }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#6c757d",
                            fontWeight: "500",
                          }}
                        >
                          Phone Number
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                          }}
                        >
                          {patient.phone}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "20px",
                        borderRadius: "12px",
                        background: "white",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        transition: "all 0.3s ease",
                        gridColumn: "span 2",
                      }}
                    >
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #0d6efd22 0%, #0dcaf044 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FaEnvelope
                          style={{ fontSize: "22px", color: "#0d6efd" }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#6c757d",
                            fontWeight: "500",
                          }}
                        >
                          Email Address
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                          }}
                        >
                          {patient.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => navigate(`/edit-profile/${patient.id}`)}
                    style={{
                      padding: "15px",
                      borderRadius: "12px",
                      fontWeight: "600",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                      fontSize: "16px",
                      boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(13, 110, 253, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(13, 110, 253, 0.3)";
                    }}
                  >
                    <FaUserEdit className="me-2" style={{ fontSize: "18px" }} />
                    Edit Profile
                  </Button>
                </div>
              )}

              {activeTab === "appointments" && (
                <div>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #0d6efd11 0%, #0dcaf022 100%)",
                      padding: "15px 20px",
                      borderRadius: "12px",
                      marginBottom: "20px",
                      border: "1px solid #0d6efd33",
                    }}
                  >
                    <p
                      style={{ margin: 0, fontSize: "14px", color: "#495057" }}
                    >
                      <strong>✓ Confirmed:</strong> Your appointment is
                      confirmed by the doctor. <br />
                      <strong>⏳ Pending:</strong> Waiting for doctor's
                      confirmation. <br />
                      <strong style={{ color: "#dc3545" }}>
                        ✗ Cancelled appointments are automatically removed.
                      </strong>
                    </p>
                  </div>
                  {renderAppointments(
                    appointments.recent,
                    "Upcoming Appointments",
                  )}
                  {renderAppointments(
                    appointments.past,
                    "Past Appointments (Last Week)",
                  )}
                  {renderAppointments(
                    appointments.older,
                    "Older Appointments (1+ Month)",
                  )}
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>

      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        centered
      >
        <Modal.Header closeButton style={{ borderBottom: "2px solid #e9ecef" }}>
          <Modal.Title style={{ color: "#2c3e50", fontWeight: "bold" }}>
            Give Review
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>
                Rating:
              </Form.Label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={28}
                    className="me-2"
                    style={{ cursor: "pointer" }}
                    color={star <= rating ? "#ffc107" : "#e9ecef"}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>
                Comment:
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  borderRadius: "10px",
                  border: "2px solid #e9ecef",
                  padding: "12px",
                }}
                placeholder="Share your experience..."
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              style={{
                padding: "12px",
                borderRadius: "10px",
                fontWeight: "600",
                border: "none",
              }}
            >
              Submit Review
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PatientProfile;
