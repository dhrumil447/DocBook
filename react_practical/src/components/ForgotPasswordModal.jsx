import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { FaKey, FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { MdLock } from "react-icons/md";

const ForgotPasswordModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      let userType = null;
      let user = null;

      // 1. Check in patients
      const patientRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/patients?email=${email}`);
      if (patientRes.data.length > 0) {
        userType = "patients";
        user = patientRes.data[0];
      }

      // 2. If not in patients, check in doctors
      if (!user) {
        const doctorRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctors?email=${email}`);
        if (doctorRes.data.length > 0) {
          userType = "doctors";
          user = doctorRes.data[0];
        }
      }

      if (!user) {
        setMessage("Email not found in our system.");
        return;
      }

      // Generate token and update user
      const token = Math.random().toString(36).substr(2);
      await axios.put(`${import.meta.env.VITE_BASE_URL}/${userType}/${user.id}`, {
        ...user,
        resetToken: token,
      });

      const resetLink = `http://localhost:7777/reset-password/${token}`;
      setMessage(`<a href="${resetLink}" target="_blank" rel="noopener noreferrer">${resetLink}</a>`);
      toast.success("Reset link generated!");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
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
          <MdLock style={{ fontSize: '24px' }} />
          Forgot Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
        }}>
          {/* Icon Header */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0d6efd22 0%, #0dcaf044 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              border: '3px solid #0d6efd33'
            }}>
              <FaKey style={{ fontSize: '35px', color: '#0d6efd' }} />
            </div>
            <h5 style={{ color: '#2c3e50', fontWeight: 'bold', marginBottom: '5px' }}>Reset Your Password</h5>
            <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>Enter your email to receive reset link</p>
          </div>

          <Form onSubmit={handleForgot}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaEnvelope style={{ color: '#0d6efd' }} />
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  fontSize: '15px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0d6efd'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </Form.Group>
            <Button 
              type="submit" 
              className="w-100"
              style={{
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 110, 253, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.3)';
              }}
            >
              <FaKey className="me-2" />
              Send Reset Link
            </Button>
          </Form>

          {message && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              borderRadius: '8px',
              background: message.includes('not found') 
                ? 'linear-gradient(135deg, #dc354522 0%, #f0849744 100%)' 
                : 'linear-gradient(135deg, #19875422 0%, #20c99744 100%)',
              border: `2px solid ${message.includes('not found') ? '#dc354533' : '#19875433'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {message.includes('not found') ? (
                <FaExclamationCircle style={{ fontSize: '24px', color: '#dc3545', flexShrink: 0 }} />
              ) : (
                <FaCheckCircle style={{ fontSize: '24px', color: '#198754', flexShrink: 0 }} />
              )}
              <div style={{
                fontWeight: '600',
                color: message.includes('not found') ? '#dc3545' : '#198754',
                fontSize: '14px'
              }} dangerouslySetInnerHTML={{ __html: message }} />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
