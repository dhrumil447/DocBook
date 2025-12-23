import { Box, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FaUserMd, FaCalendarCheck, FaHeadset, FaLock, FaHospital, FaHeartbeat, FaFileMedical, FaShieldAlt } from 'react-icons/fa';
import FeatureCard from './shared/FeatureCard';
import AnimatedCard from './shared/AnimatedCard';
import { FEATURES } from '../utils/constants';

const AboutDocBook = () => {
  const featureIcons = [FaUserMd, FaCalendarCheck, FaHeadset, FaLock, FaHospital, FaHeartbeat, FaFileMedical, FaShieldAlt];

  return (
    <Box sx={{ bgcolor: '#fff0bb', minHeight: '100vh', py: 4 }}>
      <Container>
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            About DocBook
          </Typography>
        </motion.div>

        {/* Mission & Vision */}
        <Grid container spacing={3} my={2}>
          {[
            { title: 'Our Mission', text: 'Our mission is to connect patients with nearby verified doctors seamlessly, ensuring trust and efficiency.', delay: 0 },
            { title: 'Our Vision', text: 'To be the most trusted digital platform for effortless doctor appointment booking and medical consultations.', delay: 0.2 }
          ].map((item, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <AnimatedCard delay={item.delay} sx={{ bgcolor: '#FFF04B', p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body1">{item.text}</Typography>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>

        {/* Key Features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mt={4} mb={3}>
            Key Features
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {FEATURES.map((feature, idx) => {
            const Icon = featureIcons[idx];
            return (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <FeatureCard
                  icon={<Icon />}
                  title={feature.title}
                  description={feature.text}
                  delay={idx * 0.1}
                  bgcolor="#fff"
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Why Choose DocBook */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mt={4} mb={3}>
            Why Choose DocBook?
          </Typography>
        </motion.div>

        <AnimatedCard delay={0.3} sx={{ bgcolor: '#FFF04B', p: 3 }}>
          <Typography variant="body1">
            DocBook simplifies the process of finding the best doctors nearby. With a user-friendly interface, real-time appointment booking, and comprehensive doctor verification, we ensure that your healthcare journey is smooth and hassle-free. Our platform integrates cutting-edge security measures to protect your data while offering convenient digital prescriptions and health records. Whether you need a consultation, a routine check-up, or emergency care, DocBook is your go-to healthcare companion.
          </Typography>
        </AnimatedCard>
      </Container>
    </Box>
  );
};

export default AboutDocBook;
