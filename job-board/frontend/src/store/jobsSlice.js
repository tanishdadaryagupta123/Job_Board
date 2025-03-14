import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../config/api';

const initialState = {
  jobs: [],
  filteredJobs: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalJobs: 0,
  filters: {
    location: '',
    experience: ''
  }
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (page = 1) => {
    const response = await api.get(`/jobs?page=${page}`);
    return response.data;
  }
);

export const searchJobs = createAsyncThunk(
  'jobs/searchJobs',
  async ({ query, location, experience }) => {
    try {
      const queryParams = [`q=${query}`];
      if (location) queryParams.push(`location=${location}`);
      if (experience) queryParams.push(`experience=${experience}`);
      
      const queryString = queryParams.join('&');
      const response = await api.get(`/jobs/search?${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to search jobs';
    }
  }
);

export const filterJobs = createAsyncThunk(
  'jobs/filterJobs',
  async ({ location, experience }, { getState }) => {
    try {
      // If both filters are empty, fetch all jobs
      if (!location && !experience) {
        const response = await api.get('/jobs');
        return response.data;
      }

      // Build query string based on provided filters
      const queryParams = [];
      if (location) queryParams.push(`location=${location}`);
      if (experience) queryParams.push(`experience=${experience}`);
      
      const queryString = queryParams.join('&');
      const response = await api.get(`/jobs/filter?${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to filter jobs';
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetJobs: (state) => {
      state.jobs = [];
      state.filteredJobs = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalJobs = 0;
      state.filters = {
        location: '',
        experience: ''
      };
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload.jobs;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalJobs = action.payload.totalJobs;
        state.filteredJobs = [];
        state.filters = { location: '', experience: '' };
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Search Jobs
      .addCase(searchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload.jobs;
        state.currentPage = 1;
        state.totalPages = action.payload.totalPages;
        state.totalJobs = action.payload.totalJobs;
        state.filteredJobs = [];
        state.filters = { location: '', experience: '' };
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Filter Jobs
      .addCase(filterJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(filterJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload.jobs;
        state.currentPage = 1;
        state.totalPages = action.payload.totalPages;
        state.totalJobs = action.payload.totalJobs;
      })
      .addCase(filterJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearError, resetJobs, setFilters } = jobsSlice.actions;
export default jobsSlice.reducer; 