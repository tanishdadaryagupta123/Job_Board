import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import ApplicationSuccess from './components/ApplicationSuccess';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#1976D2',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/application-success" element={<ApplicationSuccess />} />
        <Route path="/saved" element={<JobList />} />
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;