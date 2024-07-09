import React from 'react';

interface QuestionProps {
  id: number;
  title: string;
  options: string[];
}

const Question: React.FC<QuestionProps> = ({ id, title, options }) => {
  return (
    <div className="question" key={id}>
      <div className="question-title">{title}</div>
      <div className="question-options">
        {options.join(", ")}
      </div>
    </div>
  );
};

export default Question;
