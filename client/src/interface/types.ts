export interface TestHistory {
    testId: number;
    testName: string;
    startTime: string;
    endTime: string;
    score: number;
  }
  
export  interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    testHistory: TestHistory[];
    status:number;
    role:string;
  }


  export interface Course {
    id: number;
    name: string;
  }
  
  export interface Lesson {
    id: number;
    name: string;
    courseId: number;
  }
  
  export interface Test {
    id: number;
    name: string;
    lessonId: number;
  }
  
  export interface Question {
    id: number;
    title: string;
    options: string[];
    answer: number;
    testId: number;
  }
  

  export interface Data {
    courses: Course[];
    lessons: Lesson[];
    tests: Test[];
    questions: Question[];
  }