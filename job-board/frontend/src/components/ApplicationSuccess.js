import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCheckCircle = styled(CheckCircleOutline)(({ theme }) => ({
  fontSize: '4rem',
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2)
}));

function ApplicationSuccess() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            width: '100%'
          }}
        >
          <StyledCheckCircle />
          <Typography variant="h4" gutterBottom>
            Application Submitted!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Thank you for your application. We have received your submission and will review it shortly.
            You will be contacted if your qualifications match our requirements.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mr: 2 }}
            >
              Browse More Jobs
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/my-applications')}
            >
              View My Applications
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ApplicationSuccess; 