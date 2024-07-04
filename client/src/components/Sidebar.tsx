import React from 'react';
import './Sidebar.scss';

const Sidebar: React.FC<{ setActivePage: (page: string) => void }> = ({ setActivePage }) => {
  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li onClick={() => setActivePage('courses')}>Courses</li>
        <li onClick={() => setActivePage('users')}>Users</li>
      </ul>
    </div>
  );
};

export default Sidebar;
