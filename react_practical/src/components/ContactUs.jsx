import { useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button } from '@mui/material';
import { Phone, Email, LocationOn, AccessTime } from '@mui/icons-material';
import { MdLocalHospital, MdMedicalServices, MdHealthAndSafety, MdContactSupport } from 'react-icons/md';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const ContactUs = () => {
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await api.createContact(contactData);
    
    if (error) {
      toast.error('Something went wrong. Try again.');
    } else {
      toast.success('Message submitted successfully!');
      setContactData({ name: '', email: '', message: '' });
    }
  };

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: '123 Street, Prahlad Nagar, Ahmedabad, India', color: '#dc3545' },
    { icon: FaPhoneAlt, text: '+91 98765 43210', color: '#198754' },
    { icon: FaEnvelope, text: 'support@docbook.com', color: '#0d6efd' },
    { icon: FaClock, text: 'Mon - Sat: 9 AM - 6 PM', color: '#fd7e14' },
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          mb: 6
        }}
      >
        {/* Floating Background Icons */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.1,
          overflow: 'hidden'
        }}>
          <MdLocalHospital style={{ position: 'absolute', fontSize: '150px', top: '10%', left: '10%', animation: 'float 6s ease-in-out infinite' }} />
          <MdMedicalServices style={{ position: 'absolute', fontSize: '120px', bottom: '15%', right: '15%', animation: 'float 8s ease-in-out infinite' }} />
          <MdHealthAndSafety style={{ position: 'absolute', fontSize: '140px', top: '30%', right: '30%', animation: 'float 7s ease-in-out infinite' }} />
        </Box>

        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                  Get in Touch
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95, lineHeight: 1.8 }}>
                  We're here to help with any questions or feedback you may have
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Box sx={{
                  width: '180px',
                  height: '180px',
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
                  <MdContactSupport style={{ fontSize: '100px', color: 'white' }} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        <style>
          {`
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
          `}
        </style>
      </Box>

      <Container>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <Box sx={{
                background: 'white',
                borderRadius: '20px',
                p: 5,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: 'linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%)'
                }
              }}>
                <Typography variant="h4" mb={1} fontWeight="bold" color="#2c3e50">
                  Send us a Message
                </Typography>
                <Typography variant="body2" mb={4} color="#6c757d">
                  Fill out the form and we'll get back to you shortly
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField 
                    fullWidth 
                    label="Name" 
                    name="name" 
                    value={contactData.name} 
                    onChange={handleChange} 
                    required 
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#0d6efd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0d6efd',
                        },
                      },
                    }}
                  />
                  <TextField 
                    fullWidth 
                    label="Email" 
                    name="email" 
                    type="email" 
                    value={contactData.email} 
                    onChange={handleChange} 
                    required 
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#0d6efd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0d6efd',
                        },
                      },
                    }}
                  />
                  <TextField 
                    fullWidth 
                    label="Message" 
                    name="message" 
                    multiline 
                    rows={4} 
                    value={contactData.message} 
                    onChange={handleChange} 
                    required 
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover fieldset': {
                          borderColor: '#0d6efd',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0d6efd',
                        },
                      },
                    }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    sx={{ 
                      mt: 3, 
                      py: 1.5,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #0b5ed7 0%, #0ab4d4 100%)',
                        boxShadow: '0 6px 20px rgba(13, 110, 253, 0.4)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{
                background: 'white',
                borderRadius: '20px',
                p: 5,
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: 'linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%)'
                }
              }}>
                <Typography variant="h4" mb={1} fontWeight="bold" color="#2c3e50">
                  Contact Information
                </Typography>
                <Typography variant="body2" mb={4} color="#6c757d">
                  Reach out to us through any of these channels
                </Typography>
                
                {contactInfo.map(({ icon: Icon, text, color }, idx) => (
                  <Box 
                    key={idx} 
                    sx={{
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 3,
                      p: 2,
                      borderRadius: '12px',
                      backgroundColor: '#f8f9fa',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: `${color}11`,
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Box sx={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 2,
                      border: `2px solid ${color}33`
                    }}>
                      <Icon style={{ fontSize: '24px', color: color }} />
                    </Box>
                    <Typography variant="body1" color="#2c3e50" fontWeight="500">{text}</Typography>
                  </Box>
                ))}
                
                <Box mt={4} sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{
                    width: '100%',
                    height: '300px',
                    background: 'linear-gradient(135deg, #0d6efd22 0%, #0dcaf044 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <Box sx={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 30px rgba(13, 110, 253, 0.4)'
                    }}>
                      <FaMapMarkerAlt style={{ fontSize: '60px', color: 'white' }} />
                    </Box>
                    <Typography 
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        color: '#2c3e50',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    >
                      Ahmedabad, Gujarat, India
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;

