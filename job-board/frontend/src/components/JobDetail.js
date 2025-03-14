import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Container,
  Paper,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Backdrop
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = useSelector((state) =>
    state.jobs.jobs.find((job) => job._id === id)
  );
  const [isApplying, setIsApplying] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleApply = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmApply = () => {
    setShowConfirmDialog(false);
    setIsApplying(true);
    // Simulate application process
    setTimeout(() => {
      setIsApplying(false);
      navigate('/application-success');
    }, 1500);
  };

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Jobs
        </Button>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Jobs
        </Button>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {job.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<BusinessIcon />}
                  label={job.company}
                  variant="outlined"
                />
                <Chip
                  icon={<LocationOnIcon />}
                  label={job.location}
                  variant="outlined"
                />
                <Chip
                  icon={<WorkIcon />}
                  label={job.experience}
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {job.description}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Posted: {new Date(job.postedDate).toLocaleDateString()}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleApply}
                >
                  Apply Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Apply for {job.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to apply for this position at {job.company}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmApply} variant="contained" color="primary">
            Confirm Application
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isApplying}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress color="inherit" />
          <Typography variant="h6">Submitting your application...</Typography>
        </Box>
      </Backdrop>
    </Container>
  );
}

export default JobDetail; 