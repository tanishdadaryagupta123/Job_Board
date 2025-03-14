import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './jobsSlice';

const store = configureStore({
  reducer: {
    jobs: jobsReducer,
  },
});

export default store; 