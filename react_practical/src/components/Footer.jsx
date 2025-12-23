import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: LinkedIn, href: '#' },
  ];

  const quickLinks = [
    { label: 'Find a Doctor', href: '/finddoctor' },
    { label: 'Appointments', href: '/appointments' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About Us', href: '/about' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ bgcolor: '#fdfaee', py: 4 }}>
        <Divider sx={{ mb: 3 }} />
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                DocBook
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your trusted healthcare companion.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} display="block" color="inherit" underline="none" sx={{ mb: 1 }}>
                  {link.label}
                </Link>
              ))}
            </Grid>

            <Grid item xs={12} md={4} textAlign={{ xs: 'center', md: 'right' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Follow Us
              </Typography>
              <Box>
                {socialLinks.map(({ icon: Icon, href }, index) => (
                  <IconButton key={index} href={href} sx={{ color: 'black' }}>
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" textAlign="center" color="text.secondary">
            &copy; {new Date().getFullYear()} DocBook. All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    </motion.footer>
  );
};

export default Footer;

