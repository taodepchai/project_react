import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './reducers/courseSlice';
import userReducer from './reducers/userSlice';
const store = configureStore({
  reducer: {

    course: courseReducer,
    user: userReducer,
  }
});


export default store;
