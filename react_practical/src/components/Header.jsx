import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Menu as MenuIcon, Login as LoginIcon, Logout as LogoutIcon, Person as PersonIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { MdLocalHospital } from 'react-icons/md';
import { FaHome, FaUserMd, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router';
import { ShowOnLogin, ShowOnLogout } from './hiddenlinks';
import { toast } from 'react-toastify';
import { auth } from '../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setUsername(auth.getUsername());
  }, [sessionStorage.getItem('DocBook')]);

  const handleLogout = () => {
    auth.logout();
    toast.success('Logged out successfully');
    setAnchorEl(null);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/finddoctor', label: 'Find Doctors', icon: FaUserMd },
    { to: '/About', label: 'About Us', icon: FaInfoCircle },
    { to: '/Contact', label: 'Contact Us', icon: FaEnvelope },
  ];

  return (
    <AppBar position="sticky" sx={{ 
      bgcolor: 'white', 
      color: 'black', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      borderBottom: '1px solid #e9ecef'
    }}>
      <Toolbar sx={{ py: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5, 
          flexGrow: 1,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
        >
          <Box sx={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(13, 110, 253, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
              boxShadow: '0 6px 16px rgba(13, 110, 253, 0.4)'
            }
          }}>
            <MdLocalHospital style={{ fontSize: '28px', color: 'white' }} />
          </Box>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ 
              background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'cursive', 
              fontSize: '1.8rem',
              letterSpacing: '0.5px'
            }}
          >
            DocBook
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button 
                key={link.to} 
                component={NavLink} 
                to={link.to}
                startIcon={<Icon />}
                sx={{ 
                  color: 'black',
                  fontWeight: '500',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    bgcolor: 'rgba(13, 110, 253, 0.08)',
                    color: '#0d6efd',
                    transform: 'translateY(-2px)'
                  },
                  '&.active': {
                    color: '#0d6efd',
                    bgcolor: 'rgba(13, 110, 253, 0.08)',
                    borderBottom: '2px solid #0d6efd'
                  }
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>

        <ShowOnLogin>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar sx={{ 
                bgcolor: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                color: 'white',
                fontWeight: 'bold',
                width: 40,
                height: 40
              }}>
                {username[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 200
                }
              }}
            >
              <MenuItem 
                onClick={() => { navigate('/profile'); setAnchorEl(null); }}
                sx={{ py: 1.5, '&:hover': { bgcolor: '#f8f9fa' } }}
              >
                <PersonIcon sx={{ mr: 1.5, color: '#0d6efd' }} /> My Profile
              </MenuItem>
              <MenuItem 
                onClick={() => { navigate('/medicalreport'); setAnchorEl(null); }}
                sx={{ py: 1.5, '&:hover': { bgcolor: '#f8f9fa' } }}
              >
                <DescriptionIcon sx={{ mr: 1.5, color: '#0d6efd' }} /> My Medical Report
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{ py: 1.5, '&:hover': { bgcolor: '#f8f9fa', color: '#dc3545' } }}
              >
                <LogoutIcon sx={{ mr: 1.5 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </ShowOnLogin>

        <ShowOnLogout>
          <Button
            component={NavLink}
            to="/Login"
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{ 
              bgcolor: '#0d6efd',
              color: 'white',
              ml: 2,
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: '600',
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
            Login
          </Button>
        </ShowOnLogout>
      </Toolbar>
    </AppBar>
  );
};

export default Header;