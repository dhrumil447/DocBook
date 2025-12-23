import { Card, CardContent, Typography, Box } from '@mui/material';
import AnimatedCard from './AnimatedCard';

const FeatureCard = ({ icon, title, description, delay = 0, bgcolor = '#fff5d9' }) => {
  return (
    <AnimatedCard delay={delay} sx={{ bgcolor, height: '100%', textAlign: 'center', p: 2 }}>
      <CardContent>
        <Box sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </AnimatedCard>
  );
};

export default FeatureCard;
