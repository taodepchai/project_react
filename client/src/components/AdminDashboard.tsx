import React, { useState } from 'react';
import Sidebar from '../pages/admin/Sidebar';
import CourseManagement from '../pages/admin/CourseManagement';
import UserManagement from '../pages/admin/UserManagement';
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
