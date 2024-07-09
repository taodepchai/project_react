import React from "react";
import { Question } from "../../interface/types";
interface Lesson {
  id: number;
  name: string;
  description: string;
  tests: any[];
}

interface PaperProps {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  lessons: Lesson[];
}

const Paper: React.FC<PaperProps> = ({
  id,
  name,
  description,
  color,
  icon,
  lessons,
}) => {
  return (
    <div className="paper">
      <div className={`paper-header ${color}`}>
        <div className="paper-icon">{icon}</div>
        <div className="paper-title">
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
        <div className="paper-count">{lessons.length}</div>
      </div>
      <div className="paper-body">
        {lessons.map((lesson) => (
          <div className="lesson" key={lesson.id}>
            <div className="lesson-header">
              <h3>{lesson.name}</h3>
              <p>{lesson.description}</p>
            </div>
            <div className="lesson-body">
              {lesson.tests.map((test) => (
                <div className="test" key={test.id}>
                  <div className="test-header">
                    <h4>{test.name}</h4>
                    <p>{test.description}</p>
                  </div>
                  <div className="test-body">
                    {test.questions.map((question: Question) => (
                      <div className="question" key={question.id}>
                        <div className="question-title">{question.title}</div>
                        <div className="question-options">
                          {question.options.map((option, index) => (
                            <div className="option" key={index}>
                              {option}
                            </div>
                          ))}
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
    </div>
  );
};

export default Paper;
