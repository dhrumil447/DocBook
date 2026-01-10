import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Card } from "react-bootstrap";
import { FaStar, FaUserCircle, FaCommentDots } from 'react-icons/fa';
import { MdRateReview } from 'react-icons/md';

const DoctorReviews = () => {
  const [reviews, setReviews] = useState([]);
    const [patients, setPatients] = useState([]);
  
  const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;

   const fetchPatients = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients`);
        setPatients(res.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
  const getPatientName = (patientId) => {
    const patient = patients.find((pat) => pat.id === patientId);
    return patient ? patient.username : "Unknown Patient";
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews`);
        const approvedReviews = res.data.filter(
          (review) => review.status === "Approved" && review.doctorId === doctorId
        );
        setReviews(approvedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchPatients();

    if (doctorId) {
      fetchReviews();
    }
  }, [doctorId]);

  return (
    <Container className="mt-4">
      <style>{`
        .review-row {
          transition: all 0.3s ease;
        }
        .review-row:hover {
          background-color: #f8f9fa;
          transform: scale(1.01);
        }
      `}</style>

      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(255, 193, 7, 0.3)'
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
            <MdRateReview style={{ fontSize: '30px' }} />
          </div>
          <div>
            <h2 style={{ margin: '0', fontWeight: '700', fontSize: '28px' }}>Patient Reviews</h2>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '15px' }}>Feedback from your valued patients</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <Card style={{
          border: 'none',
          borderRadius: '15px',
          padding: '50px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)'
        }}>
          <MdRateReview style={{ fontSize: '60px', color: '#d0d0d0', marginBottom: '15px' }} />
          <p style={{ color: '#6c757d', fontSize: '16px', margin: 0 }}>No reviews available yet.</p>
        </Card>
      ) : (
        <Card style={{
          border: 'none',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <Table hover className="mb-0" style={{ fontSize: '15px' }}>
            <thead style={{
              background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
              color: 'white'
            }}>
              <tr>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none', width: '80px' }}>Sr.NO</th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>
                  <FaUserCircle style={{ marginRight: '8px' }} />Patient Name
                </th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none', width: '120px' }}>
                  <FaStar style={{ marginRight: '8px' }} />Rating
                </th>
                <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>
                  <FaCommentDots style={{ marginRight: '8px' }} />Review
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={review.id} className="review-row">
                  <td style={{ padding: '15px', verticalAlign: 'middle', fontWeight: '600', color: '#6c757d' }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <FaUserCircle style={{ fontSize: '20px' }} />
                      </div>
                      <span style={{ fontWeight: '600', color: '#2c3e50' }}>{getPatientName(review.patientId)}</span>
                    </div>
                  </td>
                  <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      <FaStar style={{ fontSize: '14px' }} />
                      {review.rating}
                    </div>
                  </td>
                  <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057' }}>
                    <div style={{
                      background: '#f8f9fa',
                      padding: '12px 15px',
                      borderRadius: '10px',
                      fontStyle: 'italic'
                    }}>
                      <FaCommentDots style={{ marginRight: '8px', color: '#6c757d' }} />
                      {review.comment}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
};

export default DoctorReviews;
