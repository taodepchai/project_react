import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import MainPage from "./components/MainPage";
import Contact from "./pages/user/Contact";
import Login from "./pages/until/Login";
import UserInfo from "./pages/user/UserInfo";
import Signup from "./pages/until/Signup";
import AdminChat from "./pages/admin/AdminChat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user-info/:id" element={<UserInfo />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contact-admin" element={<AdminChat />} />

    </Routes>
  );
}

export default App;
