import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Course, Lesson, Question, Test } from "../../interface/types";
import useFetchData from "../../service/data.service";
import {
  addCourse,
  addLesson,
  addQuestion,
  addTest,
  deleteCourse,
  deleteLesson,
  deleteQuestion,
  deleteTest,
  editCourse,
  editLesson,
  editQuestion,
  editTest,
  setData,
} from "../../store/reducers/courseSlice";
import "./CourseManagement.scss";

const CourseManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useFetchData();

  useEffect(() => {
    if (data) {
      dispatch(setData(data));
    }
  }, [data, dispatch]);

  const courses: Course[] = useSelector((state: any) => state.course.courses);
  const lessons: Lesson[] = useSelector((state: any) => state.course.lessons);
  const tests: Test[] = useSelector((state: any) => state.course.tests);
  const questions: Question[] = useSelector(
    (state: any) => state.course.questions
  );

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLevel, setCurrentLevel] = useState<
    "course" | "lesson" | "test" | "question"
  >("course");
  const itemsPerPage = 10;

  const paginate = (items: any[]) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const totalPages = (items: any[]) => {
    return Math.ceil(items.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAddCourse = () => {
    const courseName = prompt("Enter course name:");
    if (courseName) {
      dispatch(addCourse({ id: Date.now(), name: courseName }));
    }
  };

  const handleEditCourse = (id: number) => {
    const courseName = prompt("Edit course name:");
    if (courseName) {
      dispatch(editCourse({ id, name: courseName }));
    }
  };

  const handleDeleteCourse = (id: number) => {
    dispatch(deleteCourse(id));
  };

  const handleAddLesson = () => {
    if (selectedCourse === null) return;
    const lessonName = prompt("Enter lesson name:");
    if (lessonName) {
      dispatch(
        addLesson({
          id: Date.now(),
          name: lessonName,
          courseId: selectedCourse,
        })
      );
    }
  };

  const handleEditLesson = (id: number) => {
    if (selectedCourse === null) return;
    const lessonName = prompt("Edit lesson name:");
    if (lessonName) {
      dispatch(editLesson({ id, name: lessonName, courseId: selectedCourse }));
    }
  };

  const handleDeleteLesson = (id: number) => {
    dispatch(deleteLesson(id));
  };

  const handleAddTest = () => {
    if (selectedLesson === null) return;
    const testName = prompt("Enter test name:");
    if (testName) {
      dispatch(
        addTest({
          id: Date.now(), name: testName, lessonId: selectedLesson,
          questions: function (questions: any): unknown {
            throw new Error("Function not implemented.");
          },
          duration: 0
        })
      );
    }
  };

  const handleEditTest = (id: number) => {
    if (selectedLesson === null) return;
    const testName = prompt("Edit test name:");
    if (testName) {
      dispatch(editTest({
        id, name: testName, lessonId: selectedLesson,
        questions: function (questions: any): unknown {
          throw new Error("Function not implemented.");
        },
        duration: 0
      }));
    }
  };

  const handleDeleteTest = (id: number) => {
    dispatch(deleteTest(id));
  };

  const handleAddQuestion = () => {
    if (selectedTest === null) return;
    const questionTitle = prompt("Enter question title:");
    if (questionTitle) {
      const options = prompt("Enter options separated by commas:")?.split(",");
      const answer = parseInt(
        prompt("Enter the correct option number:") || "1",
        10
      );
      if (options) {
        dispatch(
          addQuestion({
            id: Date.now(),
            title: questionTitle,
            options,
            answer,
            testId: selectedTest,
          })
        );
      }
    }
  };

  const handleEditQuestion = (id: number) => {
    if (selectedTest === null) return;
    const questionTitle = prompt("Edit question title:");
    const options = prompt("Edit options separated by commas:")?.split(",");
    const answer = parseInt(
      prompt("Edit the correct option number:") || "1",
      10
    );
    if (questionTitle && options) {
      dispatch(
        editQuestion({
          id,
          title: questionTitle,
          options,
          answer,
          testId: selectedTest,
        })
      );
    }
  };

  const handleDeleteQuestion = (id: number) => {
    dispatch(deleteQuestion(id));
  };

  const handleViewLessons = (courseId: number) => {
    setSelectedCourse(courseId);
    setCurrentLevel("lesson");
  };

  const handleViewTests = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setCurrentLevel("test");
  };

  const handleViewQuestions = (testId: number) => {
    setSelectedTest(testId);
    setCurrentLevel("question");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="course-management">
      <h2>Course Management</h2>
      {currentLevel === "course" && (
        <>
          <button onClick={handleAddCourse}>Add Course</button>
          <ul>
            {paginate(courses).map((course: Course) => (
              <li key={course.id}>
                {course.name}
                <button onClick={() => handleEditCourse(course.id)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteCourse(course.id)}>
                  Delete
                </button>
                <button onClick={() => handleViewLessons(course.id)}>
                  View Lessons
                </button>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {[...Array(totalPages(courses)).keys()].map((number) => (
              <button key={number} onClick={() => handlePageChange(number + 1)}>
                {number + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {currentLevel === "lesson" && selectedCourse !== null && (
        <>
          <h2>Lessons</h2>
          <button onClick={handleAddLesson}>Add Lesson</button>
          <ul>
            {paginate(
              lessons.filter(
                (lesson: Lesson) => lesson.courseId === selectedCourse
              )
            ).map((lesson: Lesson) => (
              <li key={lesson.id}>
                {lesson.name}
                <button onClick={() => handleEditLesson(lesson.id)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteLesson(lesson.id)}>
                  Delete
                </button>
                <button onClick={() => handleViewTests(lesson.id)}>
                  View Tests
                </button>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {[
              ...Array(
                totalPages(
                  lessons.filter(
                    (lesson: Lesson) => lesson.courseId === selectedCourse
                  )
                )
              ).keys(),
            ].map((number) => (
              <button key={number} onClick={() => handlePageChange(number + 1)}>
                {number + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {currentLevel === "test" && selectedLesson !== null && (
        <>
          <h2>Tests</h2>
          <button onClick={handleAddTest}>Add Test</button>
          <ul>
            {paginate(
              tests.filter((test: Test) => test.lessonId === selectedLesson)
            ).map((test: Test) => (
              <li key={test.id}>
                {test.name}
                <button onClick={() => handleEditTest(test.id)}>Edit</button>
                <button onClick={() => handleDeleteTest(test.id)}>
                  Delete
                </button>
                <button onClick={() => handleViewQuestions(test.id)}>
                  View Questions
                </button>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {[
              ...Array(
                totalPages(
                  tests.filter((test: Test) => test.lessonId === selectedLesson)
                )
              ).keys(),
            ].map((number) => (
              <button key={number} onClick={() => handlePageChange(number + 1)}>
                {number + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {currentLevel === "question" && selectedTest !== null && (
        <>
          <h2>Questions</h2>
          <button onClick={handleAddQuestion}>Add Question</button>
          <ul>
            {paginate(
              questions.filter(
                (question: Question) => question.testId === selectedTest
              )
            ).map((question: Question) => (
              <li key={question.id}>
                {question.title}
                <button onClick={() => handleEditQuestion(question.id)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteQuestion(question.id)}>
                  Delete
                </button>
                <ul>
                  {question.options.map((option, index) => (
                    <li
                      key={index}
                      className={index + 1 === question.answer ? "correct" : ""}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {[
              ...Array(
                totalPages(
                  questions.filter(
                    (question: Question) => question.testId === selectedTest
                  )
                )
              ).keys(),
            ].map((number) => (
              <button key={number} onClick={() => handlePageChange(number + 1)}>
                {number + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseManagement;
