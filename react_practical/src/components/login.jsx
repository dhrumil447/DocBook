import { useState } from 'react';
import { Box, Container, Grid, Card, Typography, TextField, Button, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital, MedicalServices, HealthAndSafety, Favorite } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { api } from '../utils/api';
import { auth } from '../utils/auth';
import ForgotPasswordModal from './ForgotPasswordModal';

const Login = () => {
  const [show, setShow] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    
    console.log('🔵 Login form submitted');
    console.log('📦 Login data:', { email: formData.email, password: '***' });

    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    console.log('✅ Calling login API...');
    const { data, error } = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password
    });
    
    if (error) {
      console.error('❌ Login failed:', error);
      toast.error(error);
      return;
    }

    if (data?.success && data?.user) {
      console.log('✅ Login successful:', data.user);
      auth.setUser(data.user);
      toast.success(`Logged in Successfully ${data.user.username}`);
      
      if (data.user.isAdmin) {
        navigate('/admin');
      } else if (data.user.isDoctor) {
        navigate('/doctor');
      } else {
        navigate('/');
      }
    } else {
      console.log('❌ Invalid response from server');
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 5 }}>
      <Container maxWidth="lg">
        <Card sx={{ 
          borderRadius: 4, 
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          border: 'none'
        }}>
          <Grid container>
            <Grid 
              item 
              xs={12} 
              md={5} 
              sx={{ 
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'white', width: '100%', position: 'relative', zIndex: 2 }}>
                {/* Floating Icons Background */}
                <Box sx={{ position: 'absolute', top: 20, left: 20, opacity: 0.2 }}>
                  <LocalHospital sx={{ fontSize: 60 }} />
                </Box>
                <Box sx={{ position: 'absolute', bottom: 30, right: 30, opacity: 0.2 }}>
                  <MedicalServices sx={{ fontSize: 50 }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 100, right: 40, opacity: 0.2 }}>
                  <HealthAndSafety sx={{ fontSize: 45 }} />
                </Box>
                <Box sx={{ position: 'absolute', bottom: 120, left: 40, opacity: 0.2 }}>
                  <Favorite sx={{ fontSize: 40 }} />
                </Box>

                {/* Main Icon */}
                <Box 
                  sx={{ 
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 30px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      },
                      '50%': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                      },
                    }
                  }}
                >
                  <LocalHospital sx={{ fontSize: 80, color: 'white' }} />
                </Box>

                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Welcome Back!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, maxWidth: 280, mx: 'auto' }}>
                  Log in to access your healthcare dashboard and manage your appointments
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={7} sx={{ p: 5 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#2c3e50', mb: 1 }}>
                  Sign In
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  Enter your credentials to access your account
                </Typography>
              </Box>
            
              <Box component="form" onSubmit={loginUser}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#0d6efd',
                      },
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={show ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#0d6efd',
                      },
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShow(!show)} edge="end">
                          {show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box textAlign="right" mb={3}>
                  <Link 
                    sx={{ 
                      cursor: 'pointer',
                      color: '#0d6efd',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }} 
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    py: 1.5,
                    bgcolor: '#0d6efd', 
                    color: 'white', 
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(13, 110, 253, 0.3)',
                    '&:hover': { 
                      bgcolor: '#0b5ed7',
                      boxShadow: '0 6px 16px rgba(13, 110, 253, 0.4)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  Sign In
                </Button>

                <Typography variant="body2" textAlign="center" mt={3} sx={{ color: '#6c757d' }}>
                  Don't have an account? <Link href="/Register" sx={{ color: '#0d6efd', textDecoration: 'none', fontWeight: 600 }}>Create Account</Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        <ForgotPasswordModal show={showForgot} handleClose={() => setShowForgot(false)} />
      </Container>
    </Box>
  );
};

export default Login;

