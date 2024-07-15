import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import MainPage from "./components/MainPage";
import AdminChat from "./pages/admin/AdminChat";
import Login from "./pages/until/Login";
import Signup from "./pages/until/Signup";
import Contact from "./pages/user/Contact";
import UserInfo from "./pages/user/UserInfo";
import ExamPage from "./pages/user/ExamPage";
import { useState } from "react";

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainPage setCurrentUser={setCurrentUser} currentUser={currentUser} />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user-info/:id" element={<UserInfo />} />
      <Route
        path="/admin/:role"
        element={
          currentUser && currentUser.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <MainPage setCurrentUser={setCurrentUser} currentUser={currentUser} />
          )
        }
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contact-admin" element={<AdminChat />} />
      <Route path="/exam/:testId" element={<ExamPage />} />
    </Routes>
  );
}

export default App;

