import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form, Alert, Card } from 'react-bootstrap';
import emailjs from '@emailjs/browser';
import { FaEnvelope, FaReply, FaUser, FaPaperPlane } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

 
  const SERVICE_ID = 'service_rl0f4za';
  const TEMPLATE_ID = 'template_d6hsovm';
  const PUBLIC_KEY = 'SwJM3G57VeGq0uvhd';

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/contacts`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, []);

  const handleReplyClick = (msg) => {
    setSelectedMsg(msg);
    setReplyText('');
    setShowModal(true);
  };

  const handleSendReply = async () => {
    const templateParams = {
      user_name: selectedMsg.name,
      user_email: selectedMsg.email,
      message: replyText
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setAlert({ show: true, type: 'success', message: 'Reply sent successfully via EmailJS!' });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to send reply via EmailJS.' });
    }

    setShowModal(false);
  };

  return (
    <Container className="my-5">
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
            <MdEmail style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Contact Messages</h3>
        </div>
      </div>

      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {messages.length === 0 ? (
        <Card className="p-5" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '15px', textAlign: 'center' }}>
          <FaEnvelope style={{ fontSize: '50px', color: '#6c757d', opacity: 0.5, marginBottom: '15px' }} />
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>No messages found.</p>
        </Card>
      ) : (
        <Card style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '15px', overflow: 'hidden' }}>
          <div className="table-responsive">
            <Table className="mb-0">
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)', color: 'white' }}>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none', width: '60px' }}>#</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Name</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Email</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none' }}>Message</th>
                  <th style={{ padding: '15px', fontWeight: '600', border: 'none', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, index) => (
                  <tr key={msg.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px', verticalAlign: 'middle', fontWeight: '600', color: '#6f42c1' }}>{index + 1}</td>
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
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>{msg.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057' }}>{msg.email}</td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', color: '#495057', maxWidth: '400px' }}>{msg.message}</td>
                    <td style={{ padding: '15px', verticalAlign: 'middle', textAlign: 'center' }}>
                      <Button
                        size="sm"
                        onClick={() => handleReplyClick(msg)}
                        style={{
                          background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <FaReply /> Reply
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)', color: 'white', border: 'none' }}>
          <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaReply /> Reply to {selectedMsg?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '30px' }}>
          <Form.Group>
            <Form.Label style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>Reply Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              style={{ borderRadius: '10px', border: '2px solid #e9ecef', fontSize: '14px' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', padding: '20px' }}>
          <Button
            onClick={() => setShowModal(false)}
            style={{
              background: '#6c757d',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '600'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendReply}
            style={{
              background: 'linear-gradient(135deg, #198754, #20c997)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600'
            }}
          >
            <FaPaperPlane /> Send Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminContactMessages;
