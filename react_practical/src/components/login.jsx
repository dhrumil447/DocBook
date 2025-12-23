import { useState } from 'react';
import { Box, Container, Grid, Card, Typography, TextField, Button, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
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
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} display="flex" alignItems="center" justifyContent="center">
            <Box component="video" autoPlay loop muted width="100%" height={300}>
              <source src="https://res.cloudinary.com/dhrumil7/video/upload/v1743702698/log_jvllzo.mp4" type="video/mp4" />
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h4" color="warning.main" fontWeight="bold" textAlign="center" gutterBottom>
              Login Here
            </Typography>
            
            <Box component="form" onSubmit={loginUser} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={show ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
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

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, bgcolor: '#FFF04B', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#FFD700' } }}>
                Login
              </Button>

              <Box textAlign="right" mt={2}>
                <Typography variant="body2">
                  Don't have an account? <Link href="/Register">Create a New Account</Link>
                </Typography>
                <Typography variant="body2" mt={1}>
                  <Link sx={{ cursor: 'pointer' }} onClick={() => setShowForgot(true)}>
                    Forgot Password?
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <ForgotPasswordModal show={showForgot} handleClose={() => setShowForgot(false)} />
    </Container>
  );
};

export default Login;

