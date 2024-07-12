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
import Modal from "react-modal";

Modal.setAppElement("#root");

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentData, setCurrentData] = useState<
    Course | Lesson | Test | Question | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLevelType, setCurrentLevelType] = useState<
    "course" | "lesson" | "test" | "question"
  >("course");

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
    setModalIsOpen(true);
    setCurrentData({
      id: Date.now(),
      name: "",
    } as Course);
    setIsEditing(false);
    setCurrentLevelType("course");
  };

  const handleEditCourse = (course: Course) => {
    setModalIsOpen(true);
    setCurrentData(course);
    setIsEditing(true);
    setCurrentLevelType("course");
  };

  const handleDeleteCourse = (id: number) => {
    dispatch(deleteCourse(id));
  };

  const handleAddLesson = () => {
    if (selectedCourse === null) return;
    setModalIsOpen(true);
    setCurrentData({
      id: Date.now(),
      name: "",
      courseId: selectedCourse,
    } as Lesson);
    setIsEditing(false);
    setCurrentLevelType("lesson");
  };

  const handleEditLesson = (lesson: Lesson) => {
    setModalIsOpen(true);
    setCurrentData(lesson);
    setIsEditing(true);
    setCurrentLevelType("lesson");
  };

  const handleDeleteLesson = (id: number) => {
    dispatch(deleteLesson(id));
  };

  const handleAddTest = () => {
    if (selectedLesson === null) return;
    setModalIsOpen(true);
    setCurrentData({
      id: Date.now(),
      name: "",
      lessonId: selectedLesson,
      questions: [],
      duration: 0,
    } as unknown as Test);
    setIsEditing(false);
    setCurrentLevelType("test");
  };

  const handleEditTest = (test: Test) => {
    setModalIsOpen(true);
    setCurrentData(test);
    setIsEditing(true);
    setCurrentLevelType("test");
  };

  const handleDeleteTest = (id: number) => {
    dispatch(deleteTest(id));
  };

  const handleAddQuestion = () => {
    if (selectedTest === null) return;
    setModalIsOpen(true);
    setCurrentData({
      id: Date.now(),
      title: "",
      options: [],
      answer: 0,
      testId: selectedTest,
    } as Question);
    setIsEditing(false);
    setCurrentLevelType("question");
  };

  const handleEditQuestion = (question: Question) => {
    setModalIsOpen(true);
    setCurrentData(question);
    setIsEditing(true);
    setCurrentLevelType("question");
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

  const handleSaveData = () => {
    if (currentData) {
      if (isEditing) {
        if (currentLevelType === "course") {
          dispatch(editCourse(currentData as Course));
        } else if (currentLevelType === "lesson") {
          dispatch(editLesson(currentData as Lesson));
        } else if (currentLevelType === "test") {
          dispatch(editTest(currentData as Test));
        } else if (currentLevelType === "question") {
          dispatch(editQuestion(currentData as Question));
        }
      } else {
        if (currentLevelType === "course") {
          dispatch(addCourse(currentData as Course));
        } else if (currentLevelType === "lesson") {
          dispatch(addLesson(currentData as Lesson));
        } else if (currentLevelType === "test") {
          dispatch(addTest(currentData as Test));
        } else if (currentLevelType === "question") {
          dispatch(addQuestion(currentData as Question));
        }
      }
      setModalIsOpen(false);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setCurrentData(null);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentData((prevData) => ({
      ...prevData!,
      [name]: value,
    }));
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
                <button onClick={() => handleEditCourse(course)}>
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
                <button onClick={() => handleEditLesson(lesson)}>
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
                <button onClick={() => handleEditTest(test)}>Edit</button>
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
                <button onClick={() => handleEditQuestion(question)}>
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Course Management Modal"
      >
        <h2>{isEditing ? "Edit" : "Add"} {currentLevelType}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {currentLevelType === "course" && (
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={(currentData as Course)?.name || ""}
                onChange={handleInputChange}
              />
            </label>
          )}
          {currentLevelType === "lesson" && (
            <>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={(currentData as Lesson)?.name || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Course ID:
                <input
                  type="number"
                  name="courseId"
                  value={(currentData as Lesson)?.courseId || ""}
                  onChange={handleInputChange}
                  disabled
                />
              </label>
            </>
          )}
          {currentLevelType === "test" && (
            <>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={(currentData as Test)?.name || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Lesson ID:
                <input
                  type="number"
                  name="lessonId"
                  value={(currentData as Test)?.lessonId || ""}
                  onChange={handleInputChange}
                  disabled
                />
              </label>
              <label>
                Duration:
                <input
                  type="number"
                  name="duration"
                  value={(currentData as Test)?.duration || ""}
                  onChange={handleInputChange}
                />
              </label>
            </>
          )}
          {currentLevelType === "question" && (
            <>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={(currentData as Question)?.title || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Options:
                <input
                  type="text"
                  name="options"
                  value={
                    (currentData as Question)?.options
                      .join(",") || ""
                  }
                  onChange={(e) => {
                    setCurrentData((prevData) => ({
                      ...prevData!,
                      options: e.target.value.split(","),
                    }));
                  }}
                />
              </label>
              <label>
                Answer:
                <input
                  type="number"
                  name="answer"
                  value={(currentData as Question)?.answer || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Test ID:
                <input
                  type="number"
                  name="testId"
                  value={(currentData as Question)?.testId || ""}
                  onChange={handleInputChange}
                  disabled
                />
              </label>
            </>
          )}
          <button onClick={handleSaveData}>
            {isEditing ? "Save Changes" : "Add"}
          </button>
          <button onClick={handleCloseModal}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default CourseManagement;

