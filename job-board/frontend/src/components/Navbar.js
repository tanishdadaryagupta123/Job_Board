import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  useScrollTrigger,
  Slide,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  WorkOutline as JobIcon,
  BookmarkBorder as SavedIcon,
  NotificationsNone as NotificationIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
    handleProfileMenuClose();
  };

  const menuItems = [
    { text: 'Find Jobs', path: '/', icon: <JobIcon /> },
    { text: 'Saved Jobs', path: '/saved', icon: <SavedIcon /> },
  ];

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigate(item.path)}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {item.icon}
            <ListItemText primary={item.text} sx={{ ml: 2 }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={isScrolled ? 2 : 0}
          sx={{
            backgroundColor: isScrolled
              ? alpha(theme.palette.background.default, 0.9)
              : 'transparent',
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            transition: 'all 0.3s ease',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
              {/* Logo */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleNavigate('/')}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    letterSpacing: 0.5,
                  }}
                >
                  JobBoard
                </Typography>
              </Box>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {menuItems.map((item) => (
                    <Button
                      key={item.text}
                      startIcon={item.icon}
                      onClick={() => handleNavigate(item.path)}
                      sx={{
                        color: theme.palette.text.primary,
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
              )}

              {/* Right Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {!isMobile && (
                  <IconButton
                    size="large"
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <NotificationIcon />
                  </IconButton>
                )}

                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.primary.main}`,
                    p: 0.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    <ProfileIcon />
                  </Avatar>
                </IconButton>

                {isMobile && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            minWidth: 180,
            boxShadow: theme.shadows[3],
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleNavigate('/profile')}>
          <ProfileIcon sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate('/settings')}>Settings</MenuItem>
        <MenuItem onClick={() => handleNavigate('/logout')}>Logout</MenuItem>
      </Menu>

      {/* Toolbar spacing */}
      <Toolbar />
    </>
  );
}

export default Navbar; 