import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchData from "../service/data.service";
import { fetchUsers } from "../store/reducers/userSlice";
import "./MainPage.scss";

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users);

  const { data, loading, error } = useFetchData();
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
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
    (lesson: any) => !selectedLesson || lesson.name === selectedLesson
  );

  const getLessons = (courseId: number) =>
    data.lessons
      .filter((lesson: any) => lesson.courseId === courseId)
      .map((lesson: any) => ({
        ...lesson,
        tests: getTests(lesson.id),
      }));

  const getTests = (lessonId: number) =>
    data.tests
      .filter((test: any) => test.lessonId === lessonId)
      .map((test: any) => ({
        ...test,
        questions: getQuestions(test.id),
      }));

  const getQuestions = (testId: number) =>
    data.questions.filter((question: any) => question.testId === testId);

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
        <button
          onClick={() => {
            setSelectedCourse("");
            setSelectedLesson("");
          }}
        >
          Clear
        </button>
      </div>
      <div className="papers-section">
        {filteredCourses.map((course: any) => (
          <div key={course.id}>
            <div
              className="paper-header"
              onClick={() => setSelectedCourseId(course.id)}
            >
              <div className={`paper-icon ${course.color}`}>{course.icon}</div>
              <div className="paper-title">
                <h2>{course.name}</h2>
                <p>{course.description}</p>
              </div>
              <div className="paper-count">
                {getLessons(course.id).length} bộ đề
              </div>
            </div>
            {selectedCourseId === course.id && (
              <div className="paper-body">
                {getLessons(course.id).map((lesson: any) => (
                  <div className="lesson" key={lesson.id}>
                    <div className="lesson-header">
                      <div className="lesson-title">{lesson.name}</div>
                      <div className="lesson-count">
                        {lesson.tests.length} tests
                      </div>
                    </div>
                    <div className="lesson-body">
                      {lesson.tests.map((test: any) => (
                        <div className="test" key={test.id}>
                          <div className="test-header">
                            <div className="test-title">{test.name}</div>
                            <div className="test-count">
                              {test.questions.length} questions
                            </div>
                          </div>
                          <div className="test-body">
                            {test.questions.map((question: any) => (
                              <div className="question" key={question.id}>
                                <div className="question-title">
                                  {question.title}
                                </div>
                                <div className="question-options">
                                  {question.options.join(", ")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
