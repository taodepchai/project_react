import React, { useState } from "react";
import { useSelector } from "react-redux";

const Dashboard: React.FC = () => {
  const courses = useSelector((state: any) => state.course.courses);
  const lessons = useSelector((state: any) => state.course.lessons);
  const tests = useSelector((state: any) => state.course.tests);
  const questions = useSelector((state: any) => state.course.questions);

  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Courses</h2>
        <ul>
          {courses.map((course: any) => (
            <li key={course.id} onClick={() => setSelectedCourse(course.id)}>
              {course.name}
            </li>
          ))}
        </ul>
        {selectedCourse !== null && (
          <>
            <h2>Lessons</h2>
            <ul>
              {lessons
                .filter(
                  (lesson: { courseId: number }) =>
                    lesson.courseId === selectedCourse
                )
                .map((lesson: any) => (
                  <li
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson.id)}
                  >
                    {lesson.name}
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
                .filter((test: any) => test.lessonId === selectedLesson)
                .map((test: any) => (
                  <li key={test.id} onClick={() => setSelectedTest(test.id)}>
                    {test.name}
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
                .filter((question: any) => question.testId === selectedTest)
                .map((question: any) => (
                  <li key={question.id}>
                    {question.title}
                    <ul>
                      {question.options.map((option: any, index: number) => (
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
    </div>
  );
};

export default Dashboard;
