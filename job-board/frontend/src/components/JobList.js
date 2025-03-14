import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Pagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Chip,
  Stack,
  Container,
  InputAdornment,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  Divider,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { fetchJobs, searchJobs, filterJobs, clearError, setFilters, resetJobs } from '../store/jobsSlice';

function JobList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, status, error, currentPage, totalPages, totalJobs, filters } = useSelector((state) => state.jobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(filters.location);
  const [experience, setExperience] = useState(filters.experience);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchJobs(currentPage));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(searchJobs({ 
        query: debouncedSearchQuery,
        location,
        experience
      }));
    } else if (debouncedSearchQuery === '') {
      if (location || experience) {
        dispatch(filterJobs({ location, experience }));
      } else {
        dispatch(fetchJobs(1));
      }
    }
  }, [debouncedSearchQuery, location, experience, dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = () => {
    if (!location && !experience) {
      if (searchQuery.trim()) {
        dispatch(searchJobs({ query: searchQuery, location: '', experience: '' }));
      } else {
        dispatch(resetJobs());
        dispatch(fetchJobs(1));
      }
    } else {
      dispatch(setFilters({ location, experience }));
      if (searchQuery.trim()) {
        dispatch(searchJobs({ query: searchQuery, location, experience }));
      } else {
        dispatch(filterJobs({ location, experience }));
      }
    }
  };

  const handlePageChange = (event, value) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(fetchJobs(value));
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setLocation('');
    setExperience('');
    dispatch(resetJobs());
    dispatch(fetchJobs(1));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box mb={6} textAlign="center">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              mb: 2
            }}
          >
            Find Your Dream Job
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            Discover thousands of job opportunities from top companies around the world
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search jobs by title, company, or keywords"
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={location}
                  label="Location"
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Locations</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                  <MenuItem value="On-site">On-site</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Experience</InputLabel>
                <Select
                  value={experience}
                  label="Experience"
                  onChange={(e) => setExperience(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <WorkIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="Entry Level">Entry Level</MenuItem>
                  <MenuItem value="Mid Level">Mid Level</MenuItem>
                  <MenuItem value="Senior Level">Senior Level</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleFilter}
                startIcon={<FilterIcon />}
                sx={{
                  height: '56px',
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                  },
                }}
              >
                {isMobile ? 'Filter' : 'Apply'}
              </Button>
            </Grid>
          </Grid>
          {(location || experience || searchQuery) && (
            <Box mt={2} display="flex" justifyContent="flex-start">
              <Button
                variant="outlined"
                size="small"
                onClick={clearAllFilters}
                startIcon={<ClearIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Paper>

        {/* Results Section */}
        <Box>
          {status === 'loading' ? (
            <Box display="flex" flexDirection="column" alignItems="center" my={8}>
              <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Finding the best opportunities...
              </Typography>
            </Box>
          ) : jobs.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                px: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <WorkIcon sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h5" color="text.primary" gutterBottom>
                No jobs found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search criteria or check back later for new opportunities.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={clearAllFilters}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          ) : (
            <>
              <Box mb={3}>
                <Typography variant="h6" color="text.secondary">
                  Found {totalJobs} job{totalJobs !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {jobs.map((job) => (
                  <Grid item xs={12} key={job._id}>
                    <Fade in={true} timeout={500}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                          },
                          borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          backdropFilter: 'blur(8px)',
                        }}
                        onClick={() => handleJobClick(job._id)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                              <Typography 
                                variant="h5" 
                                component="h2" 
                                gutterBottom
                                sx={{ 
                                  fontWeight: 600,
                                  color: theme.palette.primary.main
                                }}
                              >
                                {job.title}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <BusinessIcon color="action" fontSize="small" />
                                <Typography 
                                  variant="subtitle1"
                                  sx={{ 
                                    color: theme.palette.text.primary,
                                    fontWeight: 500
                                  }}
                                >
                                  {job.company}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={2} mb={2} flexWrap="wrap" useFlexGap>
                                <Chip
                                  icon={<LocationIcon />}
                                  label={job.location}
                                  size="small"
                                  sx={{
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    '& .MuiChip-icon': {
                                      color: theme.palette.primary.main,
                                    },
                                  }}
                                />
                                <Chip
                                  icon={<WorkIcon />}
                                  label={job.experience}
                                  size="small"
                                  sx={{
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                    color: theme.palette.secondary.main,
                                    '& .MuiChip-icon': {
                                      color: theme.palette.secondary.main,
                                    },
                                  }}
                                />
                                <Chip
                                  icon={<AccessTimeIcon />}
                                  label={formatDate(job.postedDate)}
                                  size="small"
                                  sx={{
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                    color: theme.palette.success.main,
                                    '& .MuiChip-icon': {
                                      color: theme.palette.success.main,
                                    },
                                  }}
                                />
                              </Stack>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  lineHeight: 1.6,
                                }}
                              >
                                {job.description}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              justifyContent: 'center',
                              alignItems: { xs: 'flex-start', md: 'flex-end' }
                            }}>
                              <Button
                                variant="contained"
                                size="large"
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  minWidth: 140,
                                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                  '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                                  },
                                }}
                              >
                                View Details
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>

        {/* Pagination */}
        {jobs.length > 0 && (
          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "medium" : "large"}
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  margin: '0 4px',
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                    },
                  },
                },
              }}
            />
          </Box>
        )}

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            variant="filled"
            sx={{ 
              width: '100%',
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default JobList; 