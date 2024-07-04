// store/slice/courseSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, Data } from '../../interface/types';

const initialState: Data = {
  courses: [],
  lessons: [],
  tests: [],
  questions: [],
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Data>) => {
      state.courses = action.payload.courses;
      state.lessons = action.payload.lessons;
      state.tests = action.payload.tests;
      state.questions = action.payload.questions;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    editCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<number>) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
  },
});

export const { setData, addCourse, editCourse, deleteCourse } = courseSlice.actions;
export default courseSlice.reducer;
