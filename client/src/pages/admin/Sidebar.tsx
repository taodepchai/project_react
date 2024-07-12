import React from 'react';
import './Sidebar.scss';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC<{ setActivePage: (page: string) => void }> = ({ setActivePage }) => {
  const navigate = useNavigate()
  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li onClick={() => setActivePage('courses')}>Courses</li>
        <li onClick={() => setActivePage('users')}>Users</li>
        <li onClick={() => navigate("/")}>Back to main page</li>
      </ul>
    </div>
  );
};

export default Sidebar;
