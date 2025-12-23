import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Menu as MenuIcon, Login as LoginIcon, Logout as LogoutIcon, Person as PersonIcon, Description as DescriptionIcon } from '@mui/icons-material';
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
    { to: '/', label: 'Home' },
    { to: '/finddoctor', label: 'Find Doctors' },
    { to: '/About', label: 'About Us' },
    { to: '/Contact', label: 'Contact Us' },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: '#fdfaee', color: 'black', boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#FFF04B', fontFamily: 'cursive', flexGrow: 1 }}>
          DocBook
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {navLinks.map((link) => (
            <Button key={link.to} component={NavLink} to={link.to} sx={{ color: 'black' }}>
              {link.label}
            </Button>
          ))}
        </Box>

        <ShowOnLogin>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ bgcolor: '#FFF04B', color: 'black' }}>{username[0]?.toUpperCase()}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
                <PersonIcon sx={{ mr: 1 }} /> My Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/medicalreport'); setAnchorEl(null); }}>
                <DescriptionIcon sx={{ mr: 1 }} /> My Medical Report
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
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
            sx={{ bgcolor: '#FFF04B', color: 'black', ml: 2, '&:hover': { bgcolor: '#FFD700' } }}
          >
            Login
          </Button>
        </ShowOnLogout>
      </Toolbar>
    </AppBar>
  );
};

export default Header;