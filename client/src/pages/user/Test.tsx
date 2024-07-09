import React from 'react';
import Question from './Question';

interface TestProps {
  id: number;
  name: string;
  questions: any[];
}

const Test: React.FC<TestProps> = ({ id, name, questions }) => {
  return (
    <div className="test" key={id}>
      <div className="test-header">
        <div className="test-title">{name}</div>
        <div className="test-count">{questions.length} questions</div>
      </div>
      <div className="test-body">
        {questions.map((question: any) => (
          <Question key={question.id} {...question} />
        ))}
      </div>
    </div>
  );
};

export default Test;
