import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Course, Lesson, Test } from "../interface/types";
import useFetchData from "../service/data.service";
import { fetchUsers } from "../store/reducers/userSlice";
import "./MainPage.scss";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users);

  const { data, loading, error } = useFetchData();
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [showCourse, setShowCourse] = useState(true);
  const [showLesson, setShowLesson] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      if (users) {
        fetchCurrentUser(storedToken);
      }
    }
  }, [users]);

  const fetchCurrentUser = (token: string) => {
    try {
      const userId = Number(token);
      const user = users.find((user: any) => user.id === userId);
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const login = () => {
    navigate("/login");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  const filteredCourses = data.courses.filter(
    (course: any) => !selectedCourse || course.name === selectedCourse
  );
  const filteredLessons = data.lessons.filter(
    (lesson: any) =>
      !selectedLesson ||
      (selectedCourseId && lesson.courseId === selectedCourseId) ||
      lesson.name === selectedLesson
  );
  const filteredTests = data.tests.filter(
    (test: any) =>
      !selectedTest ||
      (selectedLessonId && test.lessonId === selectedLessonId) ||
      test.name === selectedTest
  );

  const handleBackToCourse = () => {
    setShowCourse(true);
    setShowLesson(false);
    setSelectedCourseId(null);
    setSelectedLesson("");
  };

  const handleBackToLesson = () => {
    setShowLesson(true);
    setShowTest(false);
    setSelectedLessonId(null);
    setSelectedTest("");
  };

  const handleBackToTest = () => {
    setShowTest(true);
    setShowQuestion(false);
    setSelectedTestId(null);
  };
  const handleStartExam = (testId: number) => {
    const selectedTest = data.tests.find((test: Test) => test.id === testId);
    if (selectedTest) {
      const selectedLesson = data.lessons.find(
        (lesson: Lesson) => lesson.id === selectedTest.lessonId
      );
      if (selectedLesson) {
        const selectedCourse = data.courses.find(
          (course: Course) => course.id === selectedLesson.courseId
        );
        if (selectedCourse) {
          navigate(`/exam/${testId}`, {
            state: {
              courseId: selectedCourse.id,
              lessonId: selectedLesson.id,
              testId: selectedTest.id,
            },
          });
        }
      }
    }
  };
  return (
    <div className="exam-papers">
      <div className="header">
        <h1>90% câu hỏi trả lời trong 10 phút</h1>
        <button>Hỏi ngay</button>
        {token ? (
          <button onClick={logout}>Đăng xuất</button>
        ) : (
          <button onClick={login}>Đăng nhập</button>
        )}
        {currentUser && <div>Welcome, {currentUser.username}!</div>}
      </div>
      <div className="filter-section">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Khoá học</option>
          {Array.from(
            new Set(data.courses.map((course: any) => course.name))
          ).map((courseName: string) => (
            <option value={courseName} key={courseName}>
              {courseName}
            </option>
          ))}
        </select>
        <select
          value={selectedLesson}
          onChange={(e) => setSelectedLesson(e.target.value)}
        >
          <option value="">Bài học</option>
          {Array.from(
            new Set(data.lessons.map((lesson: any) => lesson.name))
          ).map((lessonName: string) => (
            <option value={lessonName} key={lessonName}>
              {lessonName}
            </option>
          ))}
        </select>
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
        >
          <option value="">Bài kiểm tra</option>
          {Array.from(new Set(data.tests.map((test: any) => test.name))).map(
            (testName: string) => (
              <option value={testName} key={testName}>
                {testName}
              </option>
            )
          )}
        </select>
        <button
          onClick={() => {
            setSelectedCourse("");
            setSelectedLesson("");
            setSelectedTest("");
          }}
        >
          Clear
        </button>
      </div>
      <div className="papers-section">
        {showCourse && (
          <div className="course-section">
            {filteredCourses.map((course: any) => (
              <div key={course.id}>
                <div
                  className="paper-header"
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setShowCourse(false);
                    setShowLesson(true);
                  }}
                >
                  <div className={`paper-icon ${course.color}`}>
                    {course.icon}
                  </div>
                  <div className="paper-title">
                    <h2>{course.name}</h2>
                    <p>{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {showLesson && (
          <div className="lesson-section">
            <button onClick={handleBackToCourse}>Quay lại</button>
            {data.lessons
              .filter((lesson: any) => lesson.courseId === selectedCourseId)
              .map((lesson: any) => (
                <div key={lesson.id}>
                  <div
                    className="lesson-header"
                    onClick={() => {
                      setSelectedLessonId(lesson.id);
                      setShowLesson(false);
                      setShowTest(true);
                    }}
                  >
                    <div className="lesson-title">{lesson.name}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
        {showTest && (
          <div className="test-section">
            {" "}
            <button onClick={handleBackToLesson}>Quay lại</button>{" "}
            {data.tests
              .filter((test: any) => test.lessonId === selectedLessonId)
              .map((test: any) => (
                <div key={test.id}>
                  {" "}
                  <div
                    className="test-header"
                    onClick={() => handleStartExam(test.id)}
                  >
                    {" "}
                    <div className="test-title">{test.name}</div>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
