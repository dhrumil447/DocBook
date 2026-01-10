import React, { useEffect, useState } from "react";
import { Modal, Button, Card, Row, Col, Form } from "react-bootstrap";
import { MdVerified, MdStar, MdStarBorder } from "react-icons/md";
import { FaUserMd, FaEnvelope, FaPhone, FaVenusMars, FaBirthdayCake, FaGraduationCap, FaBriefcase, FaHospital, FaMoneyBillWave, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

const DoctorProfileModal = ({ show, handleClose, doctor }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    if (doctor) {
      fetchReviews();
    }
  }, [doctor]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews?doctorId=${doctor.id}`);
      const reviewsWithNames = await Promise.all(
        res.data.map(async (review) => {
          try {
            const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${review.patientId}`);
            return { ...review, patientName: patientRes.data.username };
          } catch (err) {
            console.error("Error fetching patient details:", err);
            return { ...review, patientName: "Unknown" };
          }
        })
      );

      setReviews(reviewsWithNames);
      calculateAverageRating(reviewsWithNames);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    setAverageRating(totalRating / reviews.length);
  };

 

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header 
        closeButton
        style={{
          background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
          color: 'white',
          borderBottom: 'none',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}
      >
        <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
          <FaUserMd style={{ fontSize: '24px' }} />
          Doctor Profile
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
        {doctor && (
          <Card style={{ 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
            borderRadius: '16px',
            border: 'none',
            backgroundColor: 'white'
          }}>
            <Card.Body style={{ padding: '30px' }}>
              <Row>
                <Col md={4} className="text-center">
                  <div style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 8px 30px rgba(13, 110, 253, 0.4)',
                    border: '5px solid white'
                  }}>
                    <FaUserMd style={{ fontSize: '80px', color: 'white' }} />
                  </div>
                  <h5 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>Dr. {doctor.username}</h5>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                    color: '#198754'
                  }}>
                    <MdVerified style={{ fontSize: '18px' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Medical Registration Verified</span>
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #0d6efd11 0%, #0dcaf022 100%)',
                    border: '2px solid #0d6efd33',
                    marginBottom: '15px'
                  }}>
                    <p style={{ margin: 0, color: '#0d6efd', fontWeight: '600', fontSize: '15px' }}>{doctor.specialization}</p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #ffc10711 0%, #ffc10722 100%)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '2px solid #ffc10733'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#2c3e50', fontSize: '14px' }}>Average Rating</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
                      {averageRating.toFixed(1)} ⭐
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6c757d' }}>({reviews.length} reviews)</p>
                  </div>
                </Col>
                <Col md={8}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px'
                  }}>
                    <div style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0d6efd22 0%, #0dcaf044 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaEnvelope style={{ fontSize: '18px', color: '#0d6efd' }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Email</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{doctor.email}</p>
                      </div>
                    </div>

                    <div style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #19875422 0%, #20c99744 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaPhone style={{ fontSize: '18px', color: '#198754' }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Phone</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{doctor.phone}</p>
                      </div>
                    </div>

                    <div style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #d6338422 0%, #f0849744 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaVenusMars style={{ fontSize: '18px', color: '#d63384' }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Gender</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{doctor.gender}</p>
                      </div>
                    </div>

                    <div style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fd7e1422 0%, #ffa94d44 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaBirthdayCake style={{ fontSize: '18px', color: '#fd7e14' }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Age</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{doctor.age} years</p>
                      </div>
                    </div>

                    <div style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6f42c122 0%, #9b6dd744 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaGraduationCap style={{ fontSize: '18px', color: '#6f42c1' }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Qualification</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{doctor.qualification}</p>
                      </div>
                    </div>

                    <div style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0dcaf022 0%, #6edff644 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaBriefcase style={{ fontSize: '18px', color: '#0dcaf0' }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Experience</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{doctor.experience} years</p>
                      </div>
                    </div>

                    <div style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #20c99722 0%, #6edff644 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaHospital style={{ fontSize: '18px', color: '#20c997' }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Clinic Name</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{doctor.clinicName}</p>
                      </div>
                    </div>

                    <div style={{
                      padding: '15px',
                      borderRadius: '12px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #19875422 0%, #20c99744 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaMoneyBillWave style={{ fontSize: '18px', color: '#198754' }} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Consultation Fee</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>₹{doctor.fees}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    borderRadius: '12px',
                    background: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #dc354522 0%, #f0849744 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FaMapMarkerAlt style={{ fontSize: '18px', color: '#dc3545' }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Clinic Address</p>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{doctor.clinicAddress}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
        
        {/* Display Reviews */}
        <h5 style={{ 
          marginTop: '30px', 
          marginBottom: '20px',
          color: '#2c3e50',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <MdStar style={{ color: '#ffc107', fontSize: '28px' }} />
          Patient Reviews
        </h5>
        {reviews.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            color: '#6c757d'
          }}>
            <MdStarBorder style={{ fontSize: '48px', color: '#dee2e6', marginBottom: '15px' }} />
            <p style={{ margin: 0, fontSize: '16px' }}>No reviews yet.</p>
          </div>
        ) : (
          <Row>
            {reviews.map((review, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card style={{
                  height: '100%',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  <Card.Body style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px'
                      }}>
                        {review.patientName[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#2c3e50', fontSize: '15px' }}>{review.patientName}</p>
                        <small style={{ color: '#6c757d', fontSize: '12px' }}>{new Date(review.date).toLocaleDateString()}</small>
                      </div>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        i < review.rating ? 
                          <MdStar key={i} style={{ color: '#ffc107', fontSize: '20px' }} /> : 
                          <MdStarBorder key={i} style={{ color: '#dee2e6', fontSize: '20px' }} />
                      ))}
                    </div>
                    <p style={{ margin: 0, color: '#495057', lineHeight: 1.6, fontSize: '14px' }}>{review.comment}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

      </Modal.Body>
      <Modal.Footer style={{ borderTop: 'none', backgroundColor: '#f8f9fa', padding: '20px 30px' }}>
        <Button 
          variant="secondary" 
          onClick={handleClose}
          style={{
            padding: '12px 30px',
            borderRadius: '8px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
            border: 'none'
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorProfileModal;
