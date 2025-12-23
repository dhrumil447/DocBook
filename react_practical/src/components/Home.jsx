import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { FaUsersViewfinder, FaUserDoctor, FaCalendarCheck } from 'react-icons/fa6';
import { FaClinicMedical } from 'react-icons/fa';
import { NavLink } from 'react-router';
import { FcSearch } from 'react-icons/fc';
import { motion } from 'framer-motion';
import HeroSection from './shared/HeroSection';
import FeatureCard from './shared/FeatureCard';
import AnimatedCard from './shared/AnimatedCard';
import { SPECIALTIES, HOW_IT_WORKS } from '../utils/constants';

const Home = () => {
  const stepIcons = [FcSearch, FaUserDoctor, FaCalendarCheck, FaClinicMedical];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection
        title="Your Health, Your Doctor, Your Choice!"
        subtitle="Book Appointments with Top Doctors Anytime, Anywhere."
        backgroundImage="https://res.cloudinary.com/dhrumil7/image/upload/v1743702393/doctor_djhnaf.png"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            component={NavLink}
            to="/Finddoctor"
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: '#FFF04B', 
              color: 'black', 
              px: 4, 
              py: 1.5, 
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#FFD700' }
            }}
            startIcon={<FaUsersViewfinder />}
          >
            Find Doctor Now
          </Button>
        </motion.div>
      </HeroSection>

      {/* Specialties Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={5}>
          Top-searched Specialties
        </Typography>
        <Grid container spacing={3}>
          {SPECIALTIES.map((specialty, index) => (
            <Grid item xs={6} md={4} lg={2} key={index}>
              <AnimatedCard delay={index * 0.1} sx={{ bgcolor: '#fff5d9', textAlign: 'center', p: 2 }}>
                <Box
                  component="img"
                  src={specialty.url}
                  sx={{ width: 80, height: 80, objectFit: 'contain', mx: 'auto', mb: 1 }}
                />
                <Typography variant="body2" fontWeight="medium">
                  {specialty.title}
                </Typography>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 6 }}>
        <Container>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={5}>
            How DocBook Works
          </Typography>
          <Grid container spacing={3}>
            {HOW_IT_WORKS.map(({ step, desc }, index) => {
              const Icon = stepIcons[index];
              return (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <FeatureCard
                    icon={<Icon />}
                    title={step}
                    description={desc}
                    delay={index * 0.15}
                    bgcolor="linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)"
                  />
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

