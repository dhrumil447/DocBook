import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form, Card } from "react-bootstrap";
import { FaStar, FaUserMd, FaUser, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdRateReview } from 'react-icons/md';

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchReviews();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews`);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients`);
      setPatients(res.data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleUpdateStatus = async (reviewId, status) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/reviews/${reviewId}`, {
        status: status,
      });
      fetchReviews();
    } catch (err) {
      console.error(`Error updating review status to ${status}:`, err);
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((doc) => doc.id === doctorId);
    return doctor ? doctor.username : "Unknown Doctor";
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((pat) => pat.id === patientId);
    return patient ? patient.username : "Unknown Patient";
  };

  return (
    <div className="container mt-4">
      <div style={{
        background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
        padding: '25px',
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(111, 66, 193, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <MdRateReview style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Review Management</h3>
        </div>
      </div>

      <Card className="p-4" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '15px' }}>
        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>Filter Reviews:</Form.Label>
          <Form.Select
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ borderRadius: '10px', border: '2px solid #e9ecef', padding: '10px' }}
          >
            <option value="All">All Reviews</option>
            <option value="Pending">Pending Reviews</option>
            <option value="Approved">Approved Reviews</option>
            <option value="Canceled">Canceled Reviews</option>
          </Form.Select>
        </Form.Group>

        <div className="table-responsive">
          <Table className="mb-0">
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)', color: 'white' }}>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Doctor</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Patient</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Rating</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Review</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews
                .filter((review) => filterStatus === "All" || review.status === filterStatus)
                .map((review) => (
                  <tr key={review.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <FaUserMd style={{ fontSize: '14px' }} />
                        </div>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>{getDoctorName(review.doctorId)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0dcaf0, #0d6efd)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <FaUser style={{ fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#495057' }}>{getPatientName(review.patientId)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontWeight: '700', fontSize: '16px', color: '#ffc107' }}>{review.rating}</span>
                        <FaStar style={{ color: '#ffc107', fontSize: '16px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057', maxWidth: '300px' }}>{review.comment}</td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: review.status === "Approved" ? 'linear-gradient(135deg, #198754, #20c997)' :
                                    review.status === "Canceled" ? 'linear-gradient(135deg, #dc3545, #c82333)' :
                                    'linear-gradient(135deg, #ffc107, #fd7e14)',
                        color: 'white',
                        display: 'inline-block'
                      }}>
                        {review.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'center' }}>
                      {review.status === "Pending" && (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(review.id, "Approved")}
                            style={{
                              background: 'linear-gradient(135deg, #198754, #20c997)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaCheckCircle /> Approve
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(review.id, "Canceled")}
                            style={{
                              background: 'linear-gradient(135deg, #dc3545, #c82333)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaTimesCircle /> Cancel
                          </Button>
                        </div>
                      )}
                      {review.status === "Approved" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(review.id, "Canceled")}
                          style={{
                            background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaTimesCircle /> Cancel Approval
                        </Button>
                      )}
                      {review.status === "Canceled" && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(review.id, "Approved")}
                          style={{
                            background: 'linear-gradient(135deg, #0dcaf0, #0d6efd)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <FaCheckCircle /> Re-Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminReview;
