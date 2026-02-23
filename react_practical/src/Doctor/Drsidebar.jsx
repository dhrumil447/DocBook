import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import axios from "axios";
import moment from "moment";
import {
  FaBook,
  FaClock,
  FaCommentMedical,
  FaHome,
  FaUserMd,
  FaHospital,
  FaCalendarDay,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCircle,
} from "react-icons/fa";
import { MdDashboard, MdPending } from "react-icons/md";
import { Nav, Offcanvas, Badge } from "react-bootstrap";

const Drsidebar = ({ show, setShow }) => {
  const [stats, setStats] = useState({
    pendingCount: 0,
    todayCount: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
      if (!doctorId) return;

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/appointments?doctor_id=${doctorId}`,
      );

      const pending = res.data.filter(
        (appt) => appt.status === "Pending",
      ).length;

      const today = moment().format("YYYY-MM-DD");
      const todayAppts = res.data.filter((appt) => {
        const apptDate = moment(appt.appointment_date).format("YYYY-MM-DD");
        return apptDate === today;
      }).length;

      setStats({
        pendingCount: pending,
        todayCount: todayAppts,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const links = [
    { url: "/doctor/dashboard", text: "Dashboard", icon: <MdDashboard /> },
    {
      url: "/doctor/today",
      text: "Today's Appointments",
      icon: <FaCalendarDay />,
      badge: stats.todayCount > 0 ? stats.todayCount : null,
      badgeColor: "#28a745",
    },
    { url: "/doctor/setslot", text: "Set Slot", icon: <FaClock /> },
    {
      url: "/doctor/ap",
      text: "All Appointments",
      icon: <FaBook />,
      badge: stats.pendingCount > 0 ? stats.pendingCount : null,
      badgeColor: "#ffc107",
    },
    {
      url: "/doctor/completed",
      text: "Completed Appointments",
      icon: <FaCheckCircle />,
    },
    {
      url: "/doctor/rejected",
      text: "Rejected Appointments",
      icon: <FaTimesCircle />,
    },
    { url: "/doctor/patient", text: "Patients", icon: <FaUserMd /> },
    { url: "/doctor/review", text: "Reviews", icon: <FaCommentMedical /> },
    { url: "/doctor/profile", text: "Edit Profile", icon: <FaUserCircle /> },
  ];

  const navLinkStyle = {
    padding: "12px 15px",
    borderRadius: "10px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    fontWeight: "500",
    textDecoration: "none",
  };

  return (
    <>
      <style>{`
        .sidebar-nav-link {
          background: transparent;
          color: white !important;
        }
        .sidebar-nav-link:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: translateX(5px);
          color: white !important;
        }
        .sidebar-nav-link.active {
          background: rgba(255, 255, 255, 0.3) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: white !important;
          font-weight: 600;
        }
        .sidebar-nav-link.active:hover {
          transform: translateX(0);
        }
      `}</style>
      <div
        className="d-none d-md-flex flex-column text-white p-3"
        style={{
          width: "250px",
          height: "250vh",
          background: "linear-gradient(180deg, #0d6efd, #0a58ca)",
          boxShadow: "4px 0 15px rgba(13, 110, 253, 0.2)",
          position: "sticky",
          top: 0,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "20px 0",
            borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              marginBottom: "10px",
            }}
          >
            <FaHospital style={{ fontSize: "24px" }} />
          </div>
          <h5 className="text-white fw-bold m-0">Doctor Panel</h5>
        </div>
        <Nav className="flex-column" style={{ overflowY: "auto", flex: 1 }}>
          {links.map((link, index) => (
            <Nav.Link
              as={NavLink}
              key={index}
              to={link.url}
              className="sidebar-nav-link mb-2"
              style={navLinkStyle}
            >
              <span style={{ fontSize: "18px" }}>{link.icon}</span>
              <span style={{ flex: 1 }}>{link.text}</span>
              {link.badge && (
                <Badge
                  pill
                  style={{
                    backgroundColor: link.badgeColor,
                    color: "white",
                    fontSize: "11px",
                    padding: "4px 8px",
                    fontWeight: "700",
                  }}
                >
                  {link.badge}
                </Badge>
              )}
            </Nav.Link>
          ))}
        </Nav>
      </div>

      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        style={{
          background: "linear-gradient(180deg, #0d6efd, #0a58ca)",
        }}
      >
        <Offcanvas.Header
          closeButton
          style={{ borderBottom: "2px solid rgba(255, 255, 255, 0.2)" }}
        >
          <Offcanvas.Title
            style={{
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaHospital style={{ fontSize: "24px" }} />
            Doctor Panel
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {links.map((link, index) => (
              <Nav.Link
                as={NavLink}
                key={index}
                to={link.url}
                className="sidebar-nav-link mb-2"
                style={navLinkStyle}
                onClick={() => setShow(false)}
              >
                <span style={{ fontSize: "18px" }}>{link.icon}</span>
                <span style={{ flex: 1 }}>{link.text}</span>
                {link.badge && (
                  <Badge
                    pill
                    style={{
                      backgroundColor: link.badgeColor,
                      color: "white",
                      fontSize: "11px",
                      padding: "4px 8px",
                      fontWeight: "700",
                    }}
                  >
                    {link.badge}
                  </Badge>
                )}
              </Nav.Link>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Drsidebar;
