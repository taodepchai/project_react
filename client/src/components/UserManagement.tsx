import React, { useEffect, useState } from "react";
import { User } from "../interface/types";
interface TestHistory {
  testId: number;
  testName: string;
  startTime: string;
  endTime: string;
  score: number;
}



const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    setUsers(data.users);
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {currentUsers.map((user, index) => (
          <li key={index}>
            <div>
              <strong>Username:</strong> {user.username}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Test History:</strong>
              <ul>
                {user.testHistory.map((test, index) => (
                  <li key={index}>
                    <div>
                      <strong>Test Name:</strong> {test.testName}
                    </div>
                    <div>
                      <strong>Start Time:</strong>{" "}
                      {new Date(test.startTime).toLocaleString()}
                    </div>
                    <div>
                      <strong>End Time:</strong>{" "}
                      {new Date(test.endTime).toLocaleString()}
                    </div>
                    <div>
                      <strong>Score:</strong> {test.score}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(
          (number) => (
            <button key={number} onClick={() => paginate(number + 1)}>
              {number + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default UserManagement;
