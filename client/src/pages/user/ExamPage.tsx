import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { TestHistory } from "../../interface/types";
import useFetchData from "../../service/data.service";
import "./ExamPage.scss";

const ExamPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useFetchData();
  const users = useSelector((state: any) => state.user.users);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<any[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  console.log(testId);
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchCurrentUser(storedToken);
    }
  }, [users]);

  useEffect(() => {
    if (data && testId) {
      const test = data.tests.find((test: any) => test.id === parseInt(testId));
      if (test) {
        setQuestions(
          data.questions.filter((question: any) => question.testId === test.id)
        );
        setTimeRemaining(1000 * 60);
      }
    }
  }, [data, testId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isExamStarted && !isExamFinished) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval!);
            setIsExamFinished(true);
            calculateScore();
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval!);
  }, [isExamStarted, isExamFinished, timeRemaining]);

  const fetchCurrentUser = (token: string) => {
    try {
      const userId = Number(token);
      const user = users.find((user: any) => user.id === userId);
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const handleAnswerChange = (questionId: number, answer: number) => {
    setSelectedAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer: any) => answer.questionId === questionId
      );
      if (existingAnswerIndex !== -1) {
        return [
          ...prevAnswers.slice(0, existingAnswerIndex),
          { questionId, answer },
          ...prevAnswers.slice(existingAnswerIndex + 1),
        ];
      } else {
        return [...prevAnswers, { questionId, answer }];
      }
    });
  };

  const startExam = () => {
    setIsExamStarted(true);
    setStartTime(new Date());
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((question: any) => {
      const selectedAnswer = selectedAnswers.find(
        (answer: any) => answer.questionId === question.id
      );
      if (selectedAnswer && selectedAnswer.answer === question.answer) {
        totalScore += 1;
      }
    });
    setScore(Math.round((totalScore / questions.length) * 100));
  };

  const submitExam = async () => {
    setIsExamFinished(true);
    calculateScore();

    if (currentUser) {
      const endTime = new Date();
      const test = data?.tests.find((test: any) => test.id === Number(testId));

      if (test && startTime) {
        const testHistory: TestHistory = {
          testId: test.id,
          testName: test.name,
          startTime: startTime.toString(),
          endTime: endTime.toString(),
          score: score,
        };

        // Tạo một bản sao của currentUser và cập nhật testHistory
        const updatedUser = {
          ...currentUser,
          testHistory: [...currentUser.testHistory, testHistory],
        };

        try {
          const response = await axios.put(
            `http://localhost:3000/account/${updatedUser.id}`,
            updatedUser
          );
          if (response.status === 200) {
            console.log("User test history updated successfully");
            setCurrentUser(updatedUser); // Cập nhật currentUser trong state
          } else {
            console.error("Error updating user test history:", response.data);
          }
        } catch (error) {
          console.error("Error updating user test history:", error);
        }
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;
  if (!questions.length) return <div>Test not found</div>;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="exam-page">
      <h1>Bài kiểm tra</h1>
      <button onClick={() => navigate(-1)}>Quay lại</button>
      {isExamStarted && !isExamFinished && (
        <div className="timer">
          Thời gian còn lại: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      )}
      {!isExamStarted && <button onClick={startExam}>Bắt đầu thi</button>}
      {isExamFinished && (
        <div className="results">
          <h2>Kết quả</h2>
          <p>Điểm số: {score}%</p>
          <button onClick={() => navigate(-1)}>Quay lại</button>
        </div>
      )}
      {isExamStarted && !isExamFinished && (
        <div className="questions">
          {questions.map((question: any) => (
            <div key={question.id} className="question">
              <div className="question-title">{question.title}</div>
              <div className="question-options">
                {question.options.map((option: string, index: number) => (
                  <div key={option} className="option">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={index + 1}
                      checked={
                        selectedAnswers.find(
                          (answer: any) =>
                            answer.questionId === question.id &&
                            answer.answer === index + 1
                        ) !== undefined
                      }
                      onChange={() =>
                        handleAnswerChange(question.id, index + 1)
                      }
                    />
                    <label htmlFor={`question-${question.id}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={submitExam}>Nộp bài</button>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
