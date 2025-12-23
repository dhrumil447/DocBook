import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  delay = 0, 
  sx = {}, 
  whileHover = { scale: 1.05, y: -5 },
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={whileHover}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          transition: 'all 0.3s',
          '&:hover': { boxShadow: 6 },
          ...sx
        }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;
