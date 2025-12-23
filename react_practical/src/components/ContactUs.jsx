import { useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button } from '@mui/material';
import { Phone, Email, LocationOn, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AnimatedCard from './shared/AnimatedCard';
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
    { icon: LocationOn, text: '123 Street, Prahlad Nagar, Ahmedabad, India', color: 'error' },
    { icon: Phone, text: '+91 98765 43210', color: 'success' },
    { icon: Email, text: 'support@docbook.com', color: 'primary' },
    { icon: AccessTime, text: 'Mon - Sat: 9 AM - 6 PM', color: 'warning' },
  ];

  return (
    <Box sx={{ bgcolor: '#fdfaee', minHeight: '100vh', py: 6 }}>
      <Container>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <AnimatedCard sx={{ bgcolor: '#fff0bb', p: 3 }}>
                <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
                  Contact Us
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField fullWidth label="Name" name="name" value={contactData.name} onChange={handleChange} required margin="normal" />
                  <TextField fullWidth label="Email" name="email" type="email" value={contactData.email} onChange={handleChange} required margin="normal" />
                  <TextField fullWidth label="Message" name="message" multiline rows={3} value={contactData.message} onChange={handleChange} required margin="normal" />
                  <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: '#FFF04B', color: 'black', '&:hover': { bgcolor: '#FFD700' } }}>
                    Submit
                  </Button>
                </Box>
              </AnimatedCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <AnimatedCard sx={{ bgcolor: '#fff0bb', p: 3 }}>
                <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
                  Our Location
                </Typography>
                {contactInfo.map(({ icon: Icon, text, color }, idx) => (
                  <Box key={idx} display="flex" alignItems="center" mb={2}>
                    <Icon color={color} sx={{ mr: 1 }} />
                    <Typography variant="body1">{text}</Typography>
                  </Box>
                ))}
                <Box mt={3} borderRadius={2} overflow="hidden">
                  <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9876543210!2d72.5079!3d23.0344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDEyJzAwLjAiTiA3MsKwMzAnMjguNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  />
                </Box>
              </AnimatedCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;

