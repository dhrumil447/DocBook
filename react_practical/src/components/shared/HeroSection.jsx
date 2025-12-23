import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  height = '450px',
  children 
}) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height,
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" paragraph>
            {subtitle}
          </Typography>
          {children}
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
