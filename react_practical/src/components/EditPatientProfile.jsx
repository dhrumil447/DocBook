import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EditPatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    gender: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching patient:", error);
        alert("Failed to load patient data.");
      }
    };
    fetchPatient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/patients/${id}`, formData);
      toast("Profile updated successfully!");
      navigate('/profile'); // Change to your actual route
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "60px 0" }}>
      <Card className="mx-auto shadow-lg border-0" style={{ 
        maxWidth: "700px", 
        borderRadius: "20px",
        overflow: "hidden"
      }}>
        <div style={{ 
          background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
          padding: "30px",
          color: "white"
        }}>
          <h3 className="fw-bold mb-2">Edit Profile</h3>
          <p className="mb-0" style={{ opacity: 0.9 }}>Update your personal information</p>
        </div>
        
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e9ecef",
                  fontSize: "15px"
                }}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: "2px solid #e9ecef",
                      fontSize: "15px"
                    }}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>Gender</Form.Label>
                  <Form.Select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    required
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      border: "2px solid #e9ecef",
                      fontSize: "15px"
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e9ecef",
                  fontSize: "15px"
                }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: "600", color: "#2c3e50" }}>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e9ecef",
                  fontSize: "15px"
                }}
              />
            </Form.Group>

            <div className="d-flex gap-3 mt-4">
              <Button 
                variant="primary" 
                type="submit"
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  border: "none",
                  fontSize: "16px"
                }}
              >
                Save Changes
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/profile')}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "16px"
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditPatientProfile;
