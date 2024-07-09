import React from 'react';
import Test from './Test';

interface LessonProps {
  id: number;
  name: string;
  tests: any[];
}

const Lesson: React.FC<LessonProps> = ({ id, name, tests }) => {
  return (
    <div className="lesson" key={id}>
      <div className="lesson-header">
        <div className="lesson-title">{name}</div>
        <div className="lesson-count">{tests.length} tests</div>
      </div>
      <div className="lesson-body">
        {tests.map((test: any) => (
          <Test key={test.id} {...test} />
        ))}
      </div>
    </div>
  );
};

export default Lesson;
