import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { MdLocalHospital, MdEmail, MdPhone } from 'react-icons/md';
import { FaUserMd, FaCalendarCheck, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: LinkedIn, href: '#' },
  ];

  const quickLinks = [
    { label: 'Find a Doctor', href: '/finddoctor', icon: FaUserMd },
    { label: 'Appointments', href: '/appointments', icon: FaCalendarCheck },
    { label: 'Contact Us', href: '/contact', icon: FaEnvelope },
    { label: 'About Us', href: '/about', icon: FaInfoCircle },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ 
        bgcolor: '#2c3e50', 
        color: 'white',
        py: 6,
        mt: 8
      }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(13, 110, 253, 0.3)'
                }}>
                  <MdLocalHospital style={{ fontSize: '24px', color: 'white' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  fontWeight="bold"
                  sx={{
                    background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'cursive'
                  }}
                >
                  DocBook
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#95a5a6', lineHeight: 1.8 }}>
                Your trusted healthcare companion for finding and booking appointments with the best doctors near you.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#ecf0f1' }}>
                Quick Links
              </Typography>
              <Box sx={{ mt: 2 }}>
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      display="block" 
                      underline="none" 
                      sx={{ 
                        mb: 1.5,
                        color: '#95a5a6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          color: '#0dcaf0',
                          pl: 1
                        }
                      }}
                    >
                      <Icon style={{ fontSize: '16px' }} />
                      {link.label}
                    </Link>
                  );
                })}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#ecf0f1' }}>
                Connect With Us
              </Typography>
              <Box sx={{ mt: 2 }}>
                {socialLinks.map(({ icon: Icon, href }, index) => (
                  <IconButton 
                    key={index} 
                    href={href} 
                    sx={{ 
                      color: '#95a5a6',
                      mr: 1,
                      '&:hover': { 
                        color: '#0dcaf0',
                        transform: 'translateY(-3px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <MdEmail style={{ fontSize: '18px', color: '#0dcaf0' }} />
                  <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                    support@docbook.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MdPhone style={{ fontSize: '18px', color: '#0dcaf0' }} />
                  <Typography variant="body2" sx={{ color: '#95a5a6' }}>
                    +91 98765 43210
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: '#34495e' }} />
          <Typography variant="body2" textAlign="center" sx={{ color: '#95a5a6' }}>
            &copy; {new Date().getFullYear()} DocBook. All Rights Reserved. | Designed with ❤️ for better healthcare
          </Typography>
        </Container>
      </Box>
    </motion.footer>
  );
};

export default Footer;

