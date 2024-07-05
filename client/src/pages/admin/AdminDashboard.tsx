import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CourseManagement from './CourseManagement';
import UserManagement from './UserManagement';
import './AdminDashboard.scss';

const AdminDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('courses');

  return (
    <div className="admin-dashboard">
      <Sidebar setActivePage={setActivePage} />
      <div className="content">
        {activePage === 'courses' && <CourseManagement />}
        {activePage === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
