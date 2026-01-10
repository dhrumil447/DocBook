import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { FaUsersViewfinder, FaUserDoctor, FaCalendarCheck } from 'react-icons/fa6';
import { FaClinicMedical, FaTooth, FaSyringe, FaStethoscope, FaBaby, FaBrain, FaFemale, FaSearch, FaCheckCircle, FaCalendarAlt, FaHospital } from 'react-icons/fa';
import { MdLocalHospital, MdHealthAndSafety, MdMedicalServices, MdFavorite } from 'react-icons/md';
import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import FeatureCard from './shared/FeatureCard';
import { HOW_IT_WORKS } from '../utils/constants';

const Home = () => {
  const stepIcons = [FaSearch, FaUserDoctor, FaCalendarAlt, FaHospital];
  
  const specialties = [
    { title: 'Tooth pain, cavity, gum issue', icon: FaTooth, color: '#0d6efd' },
    { title: 'Acne, pimple or skin issues', icon: MdHealthAndSafety, color: '#0dcaf0' },
    { title: 'Cold, cough or fever', icon: FaStethoscope, color: '#6f42c1' },
    { title: 'Child not feeling well', icon: FaBaby, color: '#d63384' },
    { title: 'Depression or anxiety', icon: FaBrain, color: '#20c997' },
    { title: 'Period doubts or Pregnancy', icon: FaFemale, color: '#fd7e14' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: 'white'
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
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                  Your Health, Your Doctor, Your Choice!
                </Typography>
                <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.95 }}>
                  Book Appointments with Top Doctors Anytime, Anywhere.
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={NavLink}
                    to="/Finddoctor"
                    variant="contained"
                    size="large"
                    sx={{ 
                      bgcolor: 'white', 
                      color: '#0d6efd', 
                      px: 4, 
                      py: 1.5, 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      borderRadius: '50px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      '&:hover': { 
                        bgcolor: '#f8f9fa',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.3)'
                      }
                    }}
                    startIcon={<FaUsersViewfinder />}
                  >
                    Find Doctor Now
                  </Button>
                </motion.div>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Box sx={{
                  width: '280px',
                  height: '280px',
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
                  <MdLocalHospital style={{ fontSize: '150px', color: 'white' }} />
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

      {/* Specialties Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2} color="#2c3e50">
          Top-searched Specialties
        </Typography>
        <Typography variant="body1" textAlign="center" mb={6} color="#6c757d">
          Find expert doctors across various medical specialties
        </Typography>
        <Grid container spacing={3}>
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon;
            return (
              <Grid item xs={6} md={4} lg={2} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Box sx={{
                    bgcolor: 'white',
                    borderRadius: '20px',
                    textAlign: 'center',
                    p: 3,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      transform: 'translateY(-5px)'
                    }
                  }}>
                    <Box sx={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${specialty.color}22 0%, ${specialty.color}44 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 15px',
                      border: `3px solid ${specialty.color}33`
                    }}>
                      <Icon style={{ fontSize: '40px', color: specialty.color }} />
                    </Box>
                    <Typography variant="body2" fontWeight="600" color="#2c3e50">
                      {specialty.title}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2} color="#2c3e50">
            How DocBook Works
          </Typography>
          <Typography variant="body1" textAlign="center" mb={6} color="#6c757d">
            Simple steps to connect with the right doctor
          </Typography>
          <Grid container spacing={4}>
            {HOW_IT_WORKS.map(({ step, desc }, index) => {
              const Icon = stepIcons[index];
              const colors = ['#0d6efd', '#0dcaf0', '#20c997', '#6f42c1'];
              return (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <Box sx={{
                      background: 'white',
                      borderRadius: '20px',
                      p: 4,
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
                        background: `linear-gradient(90deg, ${colors[index]}, ${colors[index]}88)`
                      }
                    }}>
                      <Box sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors[index]}22 0%, ${colors[index]}44 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        border: `3px solid ${colors[index]}33`
                      }}>
                        <Icon style={{ fontSize: '40px', color: colors[index] }} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="#2c3e50">
                        {step}
                      </Typography>
                      <Typography variant="body2" color="#6c757d" lineHeight={1.6}>
                        {desc}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;

