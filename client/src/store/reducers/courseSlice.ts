// store/slice/courseSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, Lesson, Test, Question, Data } from '../../interface/types';

const initialState: Data = {
  courses: [],
  lessons: [],
  tests: [],
  questions: [],
  users: undefined
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
    addLesson: (state, action: PayloadAction<Lesson>) => {
      state.lessons.push(action.payload);
    },
    editLesson: (state, action: PayloadAction<Lesson>) => {
      const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id);
      if (index !== -1) {
        state.lessons[index] = action.payload;
      }
    },
    deleteLesson: (state, action: PayloadAction<number>) => {
      state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload);
    },
    addTest: (state, action: PayloadAction<Test>) => {
      state.tests.push(action.payload);
    },
    editTest: (state, action: PayloadAction<Test>) => {
      const index = state.tests.findIndex(test => test.id === action.payload.id);
      if (index !== -1) {
        state.tests[index] = action.payload;
      }
    },
    deleteTest: (state, action: PayloadAction<number>) => {
      state.tests = state.tests.filter(test => test.id !== action.payload);
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    editQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(question => question.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    deleteQuestion: (state, action: PayloadAction<number>) => {
      state.questions = state.questions.filter(question => question.id !== action.payload);
    },
  },
});

export const {
  setData,
  addCourse,
  editCourse,
  deleteCourse,
  addLesson,
  editLesson,
  deleteLesson,
  addTest,
  editTest,
  deleteTest,
  addQuestion,
  editQuestion,
  deleteQuestion,
} = courseSlice.actions;
export default courseSlice.reducer;
