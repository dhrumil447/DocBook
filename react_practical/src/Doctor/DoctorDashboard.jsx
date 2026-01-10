import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Table } from "react-bootstrap";
import moment from "moment";
import { FaCalendarCheck, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaStethoscope } from 'react-icons/fa';
import { MdDashboard, MdTrendingUp } from 'react-icons/md';

const DoctorDashboard = () => {
  const [doctorId, setDoctorId] = useState(""); // Logged-in doctor ID
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState([]); // Initialize as an array
  const [totalPatients, setTotalPatients] = useState(0);
  const [revenue, setRevenue] = useState(0); // Total revenue

  useEffect(() => {
    const loggedInDoctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (loggedInDoctorId) {
      setDoctorId(loggedInDoctorId);
      fetchDashboardData(loggedInDoctorId);
    }
  }, []);

 const fetchDashboardData = async (doctorId) => {
  try {
    // Fetch today's appointments
    const todayResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments?doctorId=${doctorId}&date=${moment().format("YYYY-MM-DD")}`);
    setTodayAppointments(todayResponse.data.length);

    // Fetch total appointments
    const totalAppointmentsResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments?doctorId=${doctorId}`);
    setTotalAppointments(totalAppointmentsResponse.data);

    // Fetch total patients (only those with "Accepted" appointments)
    const acceptedAppointments = totalAppointmentsResponse.data.filter((appointment) => appointment.status === "Accepted");
    const uniquePatients = Array.from(new Set(acceptedAppointments.map((appointment) => appointment.patientId)))
      .map((patientId) => acceptedAppointments.find((appointment) => appointment.patientId === patientId));
    setTotalPatients(uniquePatients.length);

    // Calculate total revenue (sum of doctor fees for all accepted appointments)
    const totalRevenue = acceptedAppointments.reduce((sum, appointment) => {
      // Convert doctorFees (string) to number using parseFloat
      const fee = parseFloat(appointment.doctorFees);
      if (!isNaN(fee)) {
        return sum + fee; // Add the fee to the total revenue
      }
      return sum; // If it's not a valid number, skip it
    }, 0); // Initial value is 0 for sum
    setRevenue(totalRevenue); // Set total revenue in the state
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
      <div style={{
        background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(13, 110, 253, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <MdDashboard style={{ fontSize: '30px' }} />
          </div>
          <div>
            <h2 style={{ margin: '0', fontWeight: '700', fontSize: '28px' }}>Doctor Dashboard</h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '15px' }}>Your practice overview and statistics</p>
          </div>
        </div>
      </div>

      <Row className="mt-4">
        {/* Today's Appointments */}
        <Col md={3} className="mb-4">
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                marginBottom: '10px'
              }}>
                <FaCalendarCheck style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: 'center', padding: '20px' }}>
              <Card.Title style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Today's Appointments
              </Card.Title>
              <Card.Text style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#0d6efd',
                margin: '0'
              }}>
                {todayAppointments}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Appointments */}
        <Col md={3} className="mb-4">
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                marginBottom: '10px'
              }}>
                <FaCalendarAlt style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: 'center', padding: '20px' }}>
              <Card.Title style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Total Appointments
              </Card.Title>
              <Card.Text style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#6f42c1',
                margin: '0'
              }}>
                {totalAppointments.length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Patients with Accepted Appointments */}
        <Col md={3} className="mb-4">
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #198754, #20c997)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                marginBottom: '10px'
              }}>
                <FaUsers style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: 'center', padding: '20px' }}>
              <Card.Title style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Total Patients
              </Card.Title>
              <Card.Text style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#198754',
                margin: '0'
              }}>
                {totalPatients}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Revenue */}
        <Col md={3} className="mb-4">
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #fd7e14, #ffc107)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                marginBottom: '10px'
              }}>
                <FaMoneyBillWave style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: 'center', padding: '20px' }}>
              <Card.Title style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Total Revenue
              </Card.Title>
              <Card.Text style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#fd7e14',
                margin: '0'
              }}>
                ₹{revenue}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Table for Appointments */}
     
    </div>
  );
};

export default DoctorDashboard;
