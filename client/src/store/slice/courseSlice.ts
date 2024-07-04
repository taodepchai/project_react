import { createSlice } from '@reduxjs/toolkit';
import data from '../../data/db.json';

const initialState = {
  courses: data.courses,
  lessons: data.lessons,
  tests: data.tests,
  questions: data.questions,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    addCourse: (state, action) => {
      state.courses.push(action.payload);
    },
    editCourse: (state, action) => {
      const { id, name } = action.payload;
      const course = state.courses.find(course => course.id === id);
      if (course) {
        course.name = name;
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
  }
});

export const { addCourse, editCourse, deleteCourse } = courseSlice.actions;
export default courseSlice.reducer;
