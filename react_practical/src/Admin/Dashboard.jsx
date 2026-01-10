import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FaUserMd, FaUsers, FaMoneyBillWave, FaStar, FaClipboardList, FaCashRegister } from "react-icons/fa";
import { MdDashboard } from 'react-icons/md';

const AdminDashboard = () => {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalOnlinePayments, setTotalOnlinePayments] = useState(0);
  const [totalCODPayments, setTotalCODPayments] = useState(0);
  const [topDoctor, setTopDoctor] = useState(null);
  const [highestRatedDoctor, setHighestRatedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchPayments();
    fetchTopDoctor();
    fetchHighestRatedDoctor();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
      setTotalDoctors(res.data.length);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients`);
      setTotalPatients(res.data.length);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/payments`);
      const payments = res.data || [];

      const onlineTotal = payments.filter((p) => p.method === "Online").reduce((sum, p) => sum + p.amount, 0);
      const codTotal = payments.filter((p) => p.method === "COD").reduce((sum, p) => sum + p.amount, 0);

      setTotalOnlinePayments(onlineTotal);
      setTotalCODPayments(codTotal);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const fetchTopDoctor = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/appointments`);
      const appointments = res.data || [];

      const doctorCount = appointments.reduce((acc, app) => {
        acc[app.doctorId] = (acc[app.doctorId] || 0) + 1;
        return acc;
      }, {});

      const topDoctorId = Object.keys(doctorCount).reduce((a, b) => (doctorCount[a] > doctorCount[b] ? a : b), null);

      if (topDoctorId) {
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${topDoctorId}`);
        setTopDoctor(doctorRes.data);
      }
    } catch (err) {
      console.error("Error fetching top doctor:", err);
    }
  };

  const fetchHighestRatedDoctor = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews`);
      const reviews = res.data || [];

      const doctorRatings = reviews.reduce((acc, review) => {
        acc[review.doctorId] = acc[review.doctorId] || { total: 0, count: 0 };
        acc[review.doctorId].total += review.rating;
        acc[review.doctorId].count += 1;
        return acc;
      }, {});

      const highestRatedId = Object.keys(doctorRatings).reduce((a, b) =>
        doctorRatings[a].total / doctorRatings[a].count > doctorRatings[b].total / doctorRatings[b].count ? a : b
      );

      if (highestRatedId) {
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors/${highestRatedId}`);
        setHighestRatedDoctor({ ...doctorRes.data, rating: (doctorRatings[highestRatedId].total / doctorRatings[highestRatedId].count).toFixed(1) });
      }
    } catch (err) {
      console.error("Error fetching highest-rated doctor:", err);
    }
  };

  return (
    <Container className="mt-4">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
        background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(111, 66, 193, 0.3)'
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
            <h2 style={{ margin: '0', fontWeight: '700', fontSize: '28px' }}>Admin Dashboard</h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '15px' }}>System overview and statistics</p>
          </div>
        </div>
      </div>

      <Row>
        <Col md={4} className="mb-4">
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
                <FaUserMd style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: 'center', padding: '20px' }}>
              <Card.Title style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Total Doctors
              </Card.Title>
              <Card.Text style={{ fontSize: '32px', fontWeight: '700', color: '#0d6efd', margin: '0' }}>
                {totalDoctors}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
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
              <Card.Text style={{ fontSize: '32px', fontWeight: '700', color: '#198754', margin: '0' }}>
                {totalPatients}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
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
                Total Online Payments
              </Card.Title>
              <Card.Text style={{ fontSize: '32px', fontWeight: '700', color: '#ffc107', margin: '0' }}>
                ₹{totalOnlinePayments}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc3545, #c82333)',
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
                <FaCashRegister style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: 'center', padding: '20px' }}>
              <Card.Title style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Total COD Payments
              </Card.Title>
              <Card.Text style={{ fontSize: '32px', fontWeight: '700', color: '#dc3545', margin: '0' }}>
                ₹{totalCODPayments}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0dcaf0, #0d6efd)',
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
                <FaClipboardList style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: 'center', padding: '20px' }}>
              <Card.Title style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Most Appointments
              </Card.Title>
              <Card.Text style={{ fontSize: '18px', fontWeight: '700', color: '#0dcaf0', margin: '0' }}>
                {topDoctor ? `Dr. ${topDoctor.username}` : "No data"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="stat-card" style={{
            border: 'none',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
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
                <FaStar style={{ fontSize: '28px', color: 'white' }} />
              </div>
            </div>
            <Card.Body style={{ textAlign: 'center', padding: '20px' }}>
              <Card.Title style={{ color: '#6c757d', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                Highest Rated Doctor
              </Card.Title>
              <Card.Text style={{ fontSize: '16px', fontWeight: '700', color: '#ffc107', margin: '0' }}>
                {highestRatedDoctor ? `Dr. ${highestRatedDoctor.username} (${highestRatedDoctor.rating} ⭐)` : "No data"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
