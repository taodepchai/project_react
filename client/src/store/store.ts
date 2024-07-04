import { configureStore } from '@reduxjs/toolkit';

import courseReducer from './slice/courseSlice';
const store = configureStore({
  reducer: {

    course: courseReducer
  }
});


export default store;
