import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Course, Lesson, Question, Test } from "../interface/types";
import {
  addCourse,
  deleteCourse,
  editCourse,
} from "../store/slice/courseSlice";
import store from "../store/store";
import "./CourseManagement.scss";

const CourseManagement: React.FC = () => {
  const courses: Course[] = useSelector((state: any) => state.course.courses);
  const lessons: Lesson[] = useSelector((state: any) => state.course.lessons);
  const tests: Test[] = useSelector((state: any) => state.course.tests);
  const questions: Question[] = useSelector(
    (state: any) => state.course.questions
  );

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  const handleAddCourse = () => {
    const courseName = prompt("Enter course name:");
    if (courseName) {
      store.dispatch(addCourse({ id: courses[courses.length-1].id+1, name: courseName }));
    }
  };

  const handleEditCourse = (id: number) => {
    const courseName = prompt("Edit course name:");
    if (courseName) {
      store.dispatch(editCourse({ id, name: courseName }));
    }
  };

  const handleDeleteCourse = (id: number) => {
    store.dispatch(deleteCourse(id));
  };

  return (
    <div className="course-management">
      <h2>Course Management</h2>
      <button onClick={handleAddCourse}>Add Course</button>
      <ul>
        {courses.map((course: Course) => (
          <li key={course.id}>
            {course.name}
            <button onClick={() => handleEditCourse(course.id)}>Edit</button>
            <button onClick={() => handleDeleteCourse(course.id)}>
              Delete
            </button>
            <button onClick={() => setSelectedCourse(course.id)}>
              View Lessons
            </button>
          </li>
        ))}
      </ul>
      {selectedCourse !== null && (
        <>
          <h2>Lessons</h2>
          <ul>
            {lessons
              .filter((lesson: Lesson) => lesson.courseId === selectedCourse)
              .map((lesson: Lesson) => (
                <li key={lesson.id}>
                  {lesson.name}
                  <button onClick={() => setSelectedLesson(lesson.id)}>
                    View Tests
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
      {selectedLesson !== null && (
        <>
          <h2>Tests</h2>
          <ul>
            {tests
              .filter((test: Test) => test.lessonId === selectedLesson)
              .map((test: Test) => (
                <li key={test.id}>
                  {test.name}
                  <button onClick={() => setSelectedTest(test.id)}>
                    View Questions
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
      {selectedTest !== null && (
        <>
          <h2>Questions</h2>
          <ul>
            {questions
              .filter((question: Question) => question.testId === selectedTest)
              .map((question: Question) => (
                <li key={question.id}>
                  {question.title}
                  <ul>
                    {question.options.map((option, index) => (
                      <li
                        key={index}
                        className={
                          index + 1 === question.answer ? "correct" : ""
                        }
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default CourseManagement;
