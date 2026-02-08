import React, { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router";
import { Card, Button, Table, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";
import {
  FaUserInjured,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaCheck,
  FaTimes,
  FaPrescriptionBottleAlt,
  FaCalendarDay,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const TodayAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (!doctorId) {
      navigate("/login");
      return;
    }

    fetchTodayAppointments(doctorId);
  }, [navigate]);

  const fetchTodayAppointments = async (doctorId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/appointments?doctor_id=${doctorId}`,
      );

      // Filter today's appointments
      const today = moment().format("YYYY-MM-DD");
      const todayAppointments = res.data.filter((appt) => {
        const apptDate = moment(appt.appointment_date).format("YYYY-MM-DD");
        return apptDate === today;
      });

      const appointmentsWithPatients = await Promise.all(
        todayAppointments.map(async (appt) => {
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

      // Sort by time (earliest first)
      const sortedAppointments = appointmentsWithPatients.sort((a, b) => {
        const timeA = moment(a.slot, "HH:mm:ss");
        const timeB = moment(b.slot, "HH:mm:ss");
        return timeA.diff(timeB);
      });

      setAppointments(sortedAppointments);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to fetch today's appointments");
      setLoading(false);
    }
  };

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
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const handleWritePrescription = (appointmentId) => {
    navigate(`/doctor/prescription/${appointmentId}`);
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
          boxShadow: "0 10px 30px rgba(13, 110, 253, 0.15)",
          marginBottom: "30px",
          background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
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
              <FaCalendarDay style={{ fontSize: "28px" }} />
            </div>
            <div>
              <h3 style={{ margin: "0", fontWeight: "700" }}>
                Today's Appointments
              </h3>
              <p
                style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "15px" }}
              >
                {moment().format("dddd, MMMM DD, YYYY")} • {appointments.length}{" "}
                appointments scheduled
              </p>
            </div>
          </div>
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
          Loading today's appointments...
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
            <FaCalendarDay
              style={{
                fontSize: "64px",
                color: "#dee2e6",
                marginBottom: "20px",
              }}
            />
            <h4 style={{ color: "#6c757d", marginBottom: "10px" }}>
              No Appointments Today
            </h4>
            <p style={{ color: "#adb5bd", marginBottom: "0" }}>
              You have no scheduled appointments for today. Enjoy your free
              time!
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
                background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                color: "white",
              }}
            >
              <tr>
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
              {appointments.map((appt, index) => (
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
                      bg={
                        appt.status === "Confirmed"
                          ? "success"
                          : appt.status === "Pending"
                            ? "warning"
                            : appt.status === "Completed"
                              ? "info"
                              : "secondary"
                      }
                      style={{
                        fontSize: "13px",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "600",
                      }}
                    >
                      {appt.status}
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
                      {appt.status === "Confirmed" ? (
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
                          }}
                          onClick={() => handleWritePrescription(appt.id)}
                        >
                          <FaPrescriptionBottleAlt
                            style={{ fontSize: "12px" }}
                          />
                          Write Prescription
                        </Button>
                      ) : appt.status === "Pending" ? (
                        <>
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
                          >
                            <FaTimes style={{ fontSize: "12px" }} />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Badge
                          bg="secondary"
                          style={{
                            fontSize: "13px",
                            padding: "8px 16px",
                          }}
                        >
                          {appt.status}
                        </Badge>
                      )}
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

export default TodayAppointments;
