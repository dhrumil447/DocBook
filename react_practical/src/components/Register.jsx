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
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5} display="flex" alignItems="center" justifyContent="center">
            <Box component="img" src="https://res.cloudinary.com/dhrumil7/image/upload/v1743702401/illustration_m37hb6.png" width="100%" borderRadius={2} />
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              Patient Register
            </Typography>
            <Typography variant="body2" textAlign="right">
              Are you a doctor? <Link href="/doctorreg">Register Here</Link>
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Name" name="username" value={user.username} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" name="email" type="email" value={user.email} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone" name="phone" value={user.phone} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth label="Age" name="age" type="number" value={user.age} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth select label="Gender" name="gender" value={user.gender} onChange={handleChange} required>
                    <MenuItem value="">Select</MenuItem>
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
                  />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, bgcolor: '#FFF04B', color: 'black', fontWeight: 'bold', '&:hover': { bgcolor: '#FFD700' } }}>
                Register
              </Button>

              <Typography variant="body2" textAlign="center" mt={2}>
                Already have an account? <Link href="/Login">Log In</Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Register;

