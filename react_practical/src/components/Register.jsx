import { useState } from 'react';
import { Box, Container, Grid, Card, Typography, TextField, Button, Link, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { api } from '../utils/api';
import { validation } from '../utils/validation';

const Register = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({ username: '', email: '', password: '', cpassword: '', phone: '', gender: '', age: '', isPatients: true });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔵 Registration form submitted');
    console.log('📦 User data:', user);
    
    const { isValid, errors } = validation.validateRegistration(user);
    
    if (!isValid) {
      console.log('❌ Validation failed:', errors);
      Object.values(errors).forEach(error => toast.error(error));
      return;
    }

    console.log('✅ Validation passed, calling API...');
    const { data, error } = await api.createPatient({ ...user, createdAt: new Date() });
    
    if (error) {
      console.error('❌ Registration API error:', error);
      toast.error(error);
    } else {
      console.log('✅ Registration successful:', data);
      toast.success('Registered successfully');
      navigate('/Login');
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
                p: 4
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Box 
                  component="img" 
                  src="https://res.cloudinary.com/dhrumil7/image/upload/v1743702401/illustration_m37hb6.png" 
                  sx={{ 
                    width: '100%', 
                    maxWidth: 300,
                    filter: 'brightness(1.1)',
                    mb: 3
                  }} 
                />
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Join DocBook Today!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Book appointments with the best doctors near you
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={7} sx={{ p: 5 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#2c3e50', mb: 1 }}>
                  Patient Registration
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                  Are you a doctor? <Link href="/doctorreg" sx={{ color: '#0d6efd', textDecoration: 'none', fontWeight: 600 }}>Register Here</Link>
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Full Name" 
                      name="username" 
                      value={user.username} 
                      onChange={handleChange} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#0d6efd',
                          },
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Email Address" 
                      name="email" 
                      type="email" 
                      value={user.email} 
                      onChange={handleChange} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#0d6efd',
                          },
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Phone Number" 
                      name="phone" 
                      value={user.phone} 
                      onChange={handleChange} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#0d6efd',
                          },
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      fullWidth 
                      label="Age" 
                      name="age" 
                      type="number" 
                      value={user.age} 
                      onChange={handleChange} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#0d6efd',
                          },
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={8}>
                    <TextField 
                      fullWidth 
                      select 
                      label="Gender" 
                      name="gender" 
                      value={user.gender} 
                      onChange={handleChange} 
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#0d6efd',
                          },
                        }
                      }}
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={show ? 'text' : 'password'}
                      value={user.password}
                      onChange={handleChange}
                      required
                      sx={{
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
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="cpassword"
                      type={show ? 'text' : 'password'}
                      value={user.cpassword}
                      onChange={handleChange}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: '#0d6efd',
                          },
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    mt: 4, 
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
                  Create Account
                </Button>

                <Typography variant="body2" textAlign="center" mt={3} sx={{ color: '#6c757d' }}>
                  Already have an account? <Link href="/Login" sx={{ color: '#0d6efd', textDecoration: 'none', fontWeight: 600 }}>Log In</Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;

