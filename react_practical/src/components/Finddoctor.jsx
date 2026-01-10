import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Container, Row, Form, InputGroup, ListGroup } from "react-bootstrap";
import { MdVerified, MdLocalHospital, MdMedicalServices, MdHealthAndSafety } from "react-icons/md";
import { FaEye, FaFilter, FaUserMd, FaStethoscope, FaClinicMedical, FaHospitalUser, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import SlotSelectionModal from "./SlotSelectionModal";
import DoctorProfileModal from "./DrProfile";

const Finddoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [reviews, setReviews] = useState([]);


  const getData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors`);
      const doctorList = Array.isArray(res.data) ? res.data : res.data.doctors || [];
      setDoctors(doctorList);
      setFilteredDoctors(doctorList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
      setFilteredDoctors([]);
    }
  };

  const getSlots = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/slots`);
      setSlots(res.data || []);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setSlots([]);
    }
  };

  useEffect(() => {
    getData();
    getSlots();
  }, []);

  const filterDoctors = () => {
    let updatedList = doctors;
    if (selectedSpecialization) {
      updatedList = updatedList.filter((doctor) => doctor.specialization === selectedSpecialization);
    }

    if (searchName) {
      updatedList = updatedList.filter(
        (doctor) => doctor.username.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    setFilteredDoctors(updatedList);
  };

  useEffect(() => {
    filterDoctors();
  }, [selectedSpecialization, searchName]);

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleBookAppointment = (doctor) => {
    const patientId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (!patientId) {
      navigate("/login");
      return;
    }
    setSelectedDoctor(doctor);
    const doctorSlots = slots.find(slot => slot.doctor_id === doctor.id);
    setSelectedSlots(doctorSlots ? doctorSlots.availableSlots : []);
    setShowSlotModal(true);
  };

  const specializations = [...new Set(doctors.map(doc => doc.specialization))];

  

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/reviews`);
      const approvedReviews = res.data.filter((review) => review.status === "Approved");
      setReviews(approvedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

const getAverageRating = (doctorId) => {
  const doctorReviews = reviews.filter((review) => review.doctorId === doctorId);
  if (doctorReviews.length === 0) return "No reviews yet";
  
  const totalRating = doctorReviews.reduce((sum, review) => sum + review.rating, 0);
  return `${(totalRating / doctorReviews.length).toFixed(1)} ⭐ (${doctorReviews.length} reviews)`;
};

useEffect(() => {
  fetchReviews();
}, []);


  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container fluid className="p-0">
        <div
          style={{
            background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "100%",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            overflow: "hidden",
            color: "white"
          }}
        >
          {/* Floating Background Icons */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.1,
            overflow: 'hidden'
          }}>
            <MdLocalHospital style={{ position: 'absolute', fontSize: '180px', top: '10%', left: '5%', animation: 'float 6s ease-in-out infinite' }} />
            <MdMedicalServices style={{ position: 'absolute', fontSize: '150px', top: '50%', right: '10%', animation: 'float 8s ease-in-out infinite' }} />
            <MdHealthAndSafety style={{ position: 'absolute', fontSize: '160px', bottom: '15%', left: '70%', animation: 'float 7s ease-in-out infinite' }} />
            <FaStethoscope style={{ position: 'absolute', fontSize: '140px', top: '25%', right: '30%', animation: 'float 5s ease-in-out infinite' }} />
          </div>

          <Container style={{ maxWidth: "1200px", position: "relative", zIndex: 1 }}>
            <Row className="align-items-center">
              <Col md={8}>
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <h1 className="fw-bold mb-3" style={{ fontSize: "2.8rem", color: "white" }}>Find the Right Doctor for Your Needs</h1>
                  <p className="fs-5 mb-4" style={{ color: "rgba(255,255,255,0.95)" }}>Quickly connect with expert healthcare professionals near you</p>
                </motion.div>
              </Col>
              <Col md={4} className="d-none d-md-block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }}>
                    <FaUserMd style={{ fontSize: '100px', color: 'white' }} />
                  </div>
                </motion.div>
              </Col>
            </Row>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Row className="mt-4">
                <Col xs={12} md={10} lg={8}>
                  <InputGroup className="shadow-lg" style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: "white" }}>
                    <InputGroup.Text style={{ border: "none", backgroundColor: "white", paddingLeft: "20px" }}>
                      <FaSearch style={{ color: "#0d6efd" }} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by Doctor Name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      style={{ 
                        border: "none", 
                        padding: "15px 10px", 
                        fontSize: "1rem"
                      }}
                    />
                    <Form.Select 
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      style={{ 
                        border: "none", 
                        borderLeft: "1px solid #dee2e6",
                        padding: "15px 20px", 
                        fontSize: "1rem",
                        flex: "0 0 40%"
                      }}
                    >
                      <option value="">All Specializations</option>
                      {specializations.map((spec, index) => (
                        <option key={index} value={spec}>{spec}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Row>
            </motion.div>
          </Container>
        </div>

        <Container fluid style={{ maxWidth: "1400px", padding: "40px 20px" }}>
          <div className="mb-4">
            <h4 className="fw-bold text-dark">Available Doctors</h4>
            <p className="text-muted">Book appointments with minimum wait-time & verified doctor details</p>
          </div>
          <Row>
            <Col lg={9} md={8}>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="mb-4"
                  >
                    <Card className="border-0 shadow-sm hover-shadow" style={{ borderRadius: "16px", overflow: "hidden", transition: "all 0.3s ease" }}>
                      <Card.Body className="p-0">
                        <Row className="g-0">
                          <Col md={3} className="d-flex align-items-center justify-content-center p-3" style={{ 
                            background: "linear-gradient(135deg, #0d6efd22 0%, #0dcaf044 100%)"
                          }}>
                            <div style={{
                              width: "150px",
                              height: "150px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 8px 20px rgba(13, 110, 253, 0.3)",
                              border: "4px solid white"
                            }}>
                              <FaUserMd style={{ fontSize: "70px", color: "white" }} />
                            </div>
                          </Col>
                          <Col md={6} className="p-4">
                            <div className="d-flex align-items-center mb-2">
                              <h5 className="fw-bold mb-0 me-2">Dr. {doctor.username}</h5>
                              {doctor.is_verified === 1 && (
                                <span className="badge bg-primary d-flex align-items-center" style={{ fontSize: "0.75rem" }}>
                                  <MdVerified className="me-1" /> Verified
                                </span>
                              )}
                            </div>
                            
                            <div className="mb-3">
                              <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: "0.9rem" }}>
                                {doctor.specialization}
                              </span>
                            </div>

                            <div className="mb-2">
                              <small className="text-muted d-block mb-1">
                                <strong>Qualification:</strong> {doctor.qualification}
                              </small>
                              <small className="text-muted d-block mb-1">
                                <strong>Experience:</strong> {doctor.experience} years
                              </small>
                              <small className="text-muted d-block mb-1">
                                <strong>Clinic:</strong> {doctor.clinic_address || 'Not provided'}
                              </small>
                            </div>

                            <div className="mt-3">
                              <div className="d-flex align-items-center">
                                <span className="text-warning me-1">★★★★★</span>
                                <small className="text-muted">{getAverageRating(doctor.id)}</small>
                              </div>
                            </div>
                          </Col>
                          <Col md={3} className="d-flex flex-column align-items-center justify-content-center p-4" style={{ backgroundColor: "#f8f9fa", borderLeft: "1px solid #e9ecef" }}>
                            <div className="text-center mb-3">
                              <h3 className="fw-bold text-primary mb-0">₹{doctor.consultation_fee || 'N/A'}</h3>
                              <small className="text-muted">Consultation Fee</small>
                            </div>
                            <div className="d-grid gap-2 w-100">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => handleViewProfile(doctor)}
                                style={{ borderRadius: "8px", fontWeight: "500" }}
                              >
                                <FaEye className="me-2" />View Profile
                              </Button>
                              <Button 
                                variant="primary"
                                size="sm" 
                                onClick={() => handleBookAppointment(doctor)}
                                style={{ 
                                  borderRadius: "8px", 
                                  fontWeight: "600",
                                  backgroundColor: "#0d6efd",
                                  border: "none"
                                }}
                              >
                                Book Appointment
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">No doctors found</h5>
                  <p className="text-muted">Try adjusting your search filters</p>
                </div>
              )}
            </Col>
            <Col lg={3} md={4}>
              <div className="sticky-top" style={{ top: "20px" }}>
                <Card className="border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-bold d-flex align-items-center mb-4">
                      <FaFilter className="me-2 text-primary" /> Filter by Specialization
                    </h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item 
                        action 
                        onClick={() => setSelectedSpecialization("")} 
                        active={!selectedSpecialization}
                        className="border-0 rounded mb-2"
                        style={{ 
                          cursor: "pointer",
                          fontWeight: !selectedSpecialization ? "600" : "400",
                          backgroundColor: !selectedSpecialization ? "#0d6efd" : "transparent",
                          color: !selectedSpecialization ? "white" : "#212529"
                        }}
                      >
                        All Specializations
                      </ListGroup.Item>
                      {specializations.map((spec, index) => (
                        <ListGroup.Item 
                          key={index} 
                          action 
                          onClick={() => setSelectedSpecialization(spec)} 
                          active={selectedSpecialization === spec}
                          className="border-0 rounded mb-2"
                          style={{ 
                            cursor: "pointer",
                            fontWeight: selectedSpecialization === spec ? "600" : "400",
                            backgroundColor: selectedSpecialization === spec ? "#0d6efd" : "transparent",
                            color: selectedSpecialization === spec ? "white" : "#212529"
                          }}
                        >
                          {spec}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>

        <DoctorProfileModal show={showModal} handleClose={() => setShowModal(false)} doctor={selectedDoctor} />
        <SlotSelectionModal show={showSlotModal} handleClose={() => setShowSlotModal(false)} slots={selectedSlots} doctor={selectedDoctor}/>
      </Container>
      
      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.15) !important;
          transform: translateY(-2px);
        }
        .btn:hover {
          transform: scale(1.02);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default Finddoctor;
