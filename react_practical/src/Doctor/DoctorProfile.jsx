import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaHospital,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaSave,
  FaCalendarAlt,
  FaGraduationCap,
  FaStethoscope,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorData, setDoctorData] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "Male",
    age: "",
    specialization: "",
    qualification: "",
    experience: "",
    clinic_name: "",
    clinic_address: "",
    city: "",
    consultation_fee: "",
    available_days: "",
    available_time: "",
  });

  useEffect(() => {
    const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;
    if (!doctorId) {
      navigate("/login");
      return;
    }

    fetchDoctorProfile(doctorId);
  }, [navigate]);

  const fetchDoctorProfile = async (doctorId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/doctors/${doctorId}`,
      );

      setDoctorData({
        username: res.data.username || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        gender: res.data.gender || "Male",
        age: res.data.age || "",
        specialization: res.data.specialization || "",
        qualification: res.data.qualification || "",
        experience: res.data.experience || "",
        clinic_name: res.data.clinic_name || "",
        clinic_address: res.data.clinic_address || "",
        city: res.data.city || "",
        consultation_fee: res.data.consultation_fee || "",
        available_days: res.data.available_days || "",
        available_time: res.data.available_time || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
      toast.error("Failed to load profile data");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!doctorData.username.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!doctorData.phone.trim() || doctorData.phone.length < 10) {
      toast.error("Valid phone number is required");
      return;
    }
    if (!doctorData.specialization.trim()) {
      toast.error("Specialization is required");
      return;
    }

    try {
      setSaving(true);
      const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;

      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/doctors/${doctorId}`,
        doctorData,
      );

      toast.success("Profile updated successfully!");

      // Update session storage with new name
      const session = JSON.parse(sessionStorage.getItem("DocBook"));
      session.username = doctorData.username;
      sessionStorage.setItem("DocBook", JSON.stringify(session));

      setSaving(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          fontSize: "18px",
          color: "#6c757d",
        }}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 mb-5">
      <style>{`
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4) !important;
        }
      `}</style>

      {/* Header Card */}
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
              <MdEdit style={{ fontSize: "28px" }} />
            </div>
            <div>
              <h3 style={{ margin: "0", fontWeight: "700" }}>Edit Profile</h3>
              <p
                style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "15px" }}
              >
                Update your professional information and details
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Profile Form */}
      <Card
        style={{
          border: "none",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Card.Body style={{ padding: "40px" }}>
          <Form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div style={{ marginBottom: "35px" }}>
              <h5
                style={{
                  color: "#2c3e50",
                  fontWeight: "700",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaUserMd style={{ color: "#0d6efd" }} />
                Personal Information
              </h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      Full Name *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={doctorData.username}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      <FaEnvelope
                        style={{ marginRight: "8px", color: "#6c757d" }}
                      />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={doctorData.email}
                      disabled
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                    <Form.Text className="text-muted">
                      Email cannot be changed
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      <FaPhone
                        style={{ marginRight: "8px", color: "#0d6efd" }}
                      />
                      Phone Number *
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={doctorData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      Gender
                    </Form.Label>
                    <Form.Select
                      name="gender"
                      value={doctorData.gender}
                      onChange={handleChange}
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      Age
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      value={doctorData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      min="25"
                      max="80"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Professional Information */}
            <div style={{ marginBottom: "35px" }}>
              <h5
                style={{
                  color: "#2c3e50",
                  fontWeight: "700",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaStethoscope style={{ color: "#198754" }} />
                Professional Information
              </h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      Specialization *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="specialization"
                      value={doctorData.specialization}
                      onChange={handleChange}
                      placeholder="e.g., Cardiologist"
                      required
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      <FaGraduationCap
                        style={{ marginRight: "8px", color: "#fd7e14" }}
                      />
                      Qualification
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="qualification"
                      value={doctorData.qualification}
                      onChange={handleChange}
                      placeholder="e.g., MBBS, MD"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      Experience (Years)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="experience"
                      value={doctorData.experience}
                      onChange={handleChange}
                      placeholder="Years of experience"
                      min="0"
                      max="50"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Clinic Information */}
            <div style={{ marginBottom: "35px" }}>
              <h5
                style={{
                  color: "#2c3e50",
                  fontWeight: "700",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaHospital style={{ color: "#dc3545" }} />
                Clinic Information
              </h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      Clinic Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="clinic_name"
                      value={doctorData.clinic_name}
                      onChange={handleChange}
                      placeholder="Enter clinic name"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      <FaMapMarkerAlt
                        style={{ marginRight: "8px", color: "#dc3545" }}
                      />
                      City
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={doctorData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      Clinic Address
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="clinic_address"
                      value={doctorData.clinic_address}
                      onChange={handleChange}
                      placeholder="Enter complete clinic address"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Availability & Fees */}
            <div style={{ marginBottom: "35px" }}>
              <h5
                style={{
                  color: "#2c3e50",
                  fontWeight: "700",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FaClock style={{ color: "#ffc107" }} />
                Availability & Consultation
              </h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      <FaMoneyBillWave
                        style={{ marginRight: "8px", color: "#198754" }}
                      />
                      Consultation Fee (₹)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="consultation_fee"
                      value={doctorData.consultation_fee}
                      onChange={handleChange}
                      placeholder="Enter consultation fee"
                      min="0"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      <FaCalendarAlt
                        style={{ marginRight: "8px", color: "#6f42c1" }}
                      />
                      Available Days
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="available_days"
                      value={doctorData.available_days}
                      onChange={handleChange}
                      placeholder="e.g., Mon-Fri"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                      <FaClock
                        style={{ marginRight: "8px", color: "#17a2b8" }}
                      />
                      Available Time
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="available_time"
                      value={doctorData.available_time}
                      onChange={handleChange}
                      placeholder="e.g., 9 AM - 5 PM"
                      style={{
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Submit Button */}
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Button
                type="submit"
                disabled={saving}
                className="save-btn"
                style={{
                  background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                  border: "none",
                  padding: "15px 50px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                }}
              >
                <FaSave style={{ fontSize: "18px" }} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DoctorProfile;
