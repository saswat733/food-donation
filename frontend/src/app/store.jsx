// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../utils/slice/UserSlice.jsx'

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
