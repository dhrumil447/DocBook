import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Form, Button, Container, Card } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLock, FaKey, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { MdSecurity, MdLockReset } from 'react-icons/md';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState(""); // patients or doctors
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // 1. Check patients
        const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients?resetToken=${token}`);
        if (patientRes.data.length > 0) {
          setUserType("patients");
          setUserId(patientRes.data[0].id);
          setLoading(false);
          return;
        }

        // 2. Check doctors
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors?resetToken=${token}`);
        if (doctorRes.data.length > 0) {
          setUserType("doctors");
          setUserId(doctorRes.data[0].id);
          setLoading(false);
          return;
        }

        toast.error("Invalid or expired reset link");
        navigate("/login");
      } catch (err) {
        toast.error("Error checking reset link");
      }
    };

    checkToken();
  }, [token, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/${userType}/${userId}`);
      const updatedUser = { ...res.data, password: newPassword, resetToken: "" }; // Clear token

      await axios.put(`${import.meta.env.VITE_BASE_URL}/${userType}/${userId}`, updatedUser);

      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  if (loading) return (
    <Container className="mt-5">
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
          marginBottom: '20px',
          animation: 'pulse 2s infinite'
        }}>
          <MdSecurity style={{ fontSize: '40px', color: 'white' }} />
        </div>
        <h5 style={{ color: '#0d6efd', fontWeight: '600' }}>Verifying reset link...</h5>
      </div>
    </Container>
  );

  return (
    <Container className="mt-5 col-md-6">
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
      
      <Card className="shadow-lg" style={{ borderRadius: '20px', border: 'none', overflow: 'hidden' }}>
        {/* Gradient Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0d6efd, #0dcaf0)',
          padding: '30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            marginBottom: '15px'
          }}>
            <MdLockReset style={{ fontSize: '30px' }} />
          </div>
          <h4 style={{ margin: '0', fontWeight: '600' }}>Reset Your Password</h4>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Create a new secure password</p>
        </div>

        {/* Central Icon */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #198754, #20c997)',
            boxShadow: '0 8px 25px rgba(25, 135, 84, 0.3)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <FaKey style={{ fontSize: '50px', color: 'white' }} />
          </div>
        </div>

        <div className="p-4">
          <Form onSubmit={handleReset}>
            {/* New Password */}
            <Form.Group className="mb-3">
              <Form.Label style={{ 
                fontWeight: '600', 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaLock style={{ color: '#0d6efd' }} />
                New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0d6efd'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </Form.Group>

            {/* Confirm Password */}
            <Form.Group className="mb-3">
              <Form.Label style={{ 
                fontWeight: '600', 
                color: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaShieldAlt style={{ color: '#198754' }} />
                Confirm New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '15px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#198754'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </Form.Group>

            {/* Security Tips */}
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <MdSecurity style={{ fontSize: '20px', color: '#0d6efd' }} />
                <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>Security Tips</span>
              </div>
              <ul style={{ margin: '0', paddingLeft: '30px', fontSize: '13px', color: '#6c757d' }}>
                <li>Use at least 8 characters</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Add numbers and special characters</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-100"
              style={{
                background: 'linear-gradient(135deg, #198754, #20c997)',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(25, 135, 84, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(25, 135, 84, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(25, 135, 84, 0.3)';
              }}
            >
              <FaCheckCircle style={{ fontSize: '18px' }} />
              Update Password
            </Button>
          </Form>
        </div>
      </Card>
    </Container>
  );
};

export default ResetPassword;
