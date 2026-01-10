import { Box, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FaUserMd, FaCalendarCheck, FaHeadset, FaLock, FaHospital, FaHeartbeat, FaFileMedical, FaShieldAlt, FaBullseye, FaEye } from 'react-icons/fa';
import { MdLocalHospital, MdMedicalServices, MdHealthAndSafety, MdFavorite } from 'react-icons/md';
import FeatureCard from './shared/FeatureCard';
import { FEATURES } from '../utils/constants';

const AboutDocBook = () => {
  const featureIcons = [FaUserMd, FaCalendarCheck, FaHeadset, FaLock, FaHospital, FaHeartbeat, FaFileMedical, FaShieldAlt];
  const colors = ['#0d6efd', '#0dcaf0', '#20c997', '#6f42c1', '#d63384', '#fd7e14', '#ffc107', '#198754'];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
          minHeight: '400px',
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
          <MdLocalHospital style={{ position: 'absolute', fontSize: '200px', top: '10%', left: '10%', animation: 'float 6s ease-in-out infinite' }} />
          <MdMedicalServices style={{ position: 'absolute', fontSize: '150px', top: '60%', right: '15%', animation: 'float 8s ease-in-out infinite' }} />
          <MdHealthAndSafety style={{ position: 'absolute', fontSize: '180px', bottom: '10%', left: '60%', animation: 'float 7s ease-in-out infinite' }} />
          <MdFavorite style={{ position: 'absolute', fontSize: '120px', top: '30%', right: '40%', animation: 'float 5s ease-in-out infinite' }} />
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
                  About DocBook
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95, lineHeight: 1.8 }}>
                  Connecting patients with trusted healthcare professionals through seamless digital platform
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
                  <MdLocalHospital style={{ fontSize: '120px', color: 'white' }} />
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

        {/* Mission & Vision */}
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2} color="#2c3e50">
          Our Purpose
        </Typography>
        <Typography variant="body1" textAlign="center" mb={5} color="#6c757d">
          Committed to transforming healthcare accessibility
        </Typography>

        <Grid container spacing={4} mb={6}>
          {[
            { 
              title: 'Our Mission', 
              text: 'Our mission is to connect patients with nearby verified doctors seamlessly, ensuring trust and efficiency in every healthcare interaction.', 
              icon: FaBullseye,
              color: '#0d6efd'
            },
            { 
              title: 'Our Vision', 
              text: 'To be the most trusted digital platform for effortless doctor appointment booking and medical consultations across the nation.', 
              icon: FaEye,
              color: '#0dcaf0'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Grid item xs={12} md={6} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <Box sx={{
                    background: 'white',
                    borderRadius: '20px',
                    p: 4,
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`
                    }
                  }}>
                    <Box sx={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${item.color}22 0%, ${item.color}44 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      border: `3px solid ${item.color}33`
                    }}>
                      <Icon style={{ fontSize: '35px', color: item.color }} />
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom color="#2c3e50">
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="#6c757d" lineHeight={1.7}>
                      {item.text}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Key Features */}
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2} color="#2c3e50">
          Key Features
        </Typography>
        <Typography variant="body1" textAlign="center" mb={5} color="#6c757d">
          Everything you need for seamless healthcare management
        </Typography>

        <Grid container spacing={3} mb={6}>
          {FEATURES.map((feature, idx) => {
            const Icon = featureIcons[idx];
            return (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Box sx={{
                    background: 'white',
                    borderRadius: '20px',
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      transform: 'translateY(-5px)',
                      transition: 'all 0.3s ease'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${colors[idx]}, ${colors[idx]}88)`
                    }
                  }}>
                    <Box sx={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors[idx]}22 0%, ${colors[idx]}44 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      border: `3px solid ${colors[idx]}33`
                    }}>
                      <Icon style={{ fontSize: '35px', color: colors[idx] }} />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="#2c3e50">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="#6c757d" lineHeight={1.6}>
                      {feature.text}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Why Choose DocBook */}
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2} color="#2c3e50">
          Why Choose DocBook?
        </Typography>
        <Typography variant="body1" textAlign="center" mb={5} color="#6c757d">
          Your trusted partner in healthcare journey
        </Typography>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Box sx={{
            background: 'white',
            borderRadius: '20px',
            p: 5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden',
            mb: 4,
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
            <Typography variant="body1" color="#6c757d" lineHeight={1.8} sx={{ fontSize: '1.1rem' }}>
              DocBook simplifies the process of finding the best doctors nearby. With a user-friendly interface, real-time appointment booking, and comprehensive doctor verification, we ensure that your healthcare journey is smooth and hassle-free. Our platform integrates cutting-edge security measures to protect your data while offering convenient digital prescriptions and health records. Whether you need a consultation, a routine check-up, or emergency care, DocBook is your go-to healthcare companion.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutDocBook;
