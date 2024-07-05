import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import courseReducer from './slice/courseSlice';
const store = configureStore({
  reducer: {

    course: courseReducer,
    user: userReducer,
  }
});


export default store;
