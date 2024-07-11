import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./pages/until/Login";
import Signup from "./pages/until/Signup";
import MainPage from "./components/MainPage";
import ExamPage from "./pages/user/ExamPage";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login></Login>} />
        <Route path="/signup" element={<Signup></Signup>} />
        <Route path="/admin" element={<AdminDashboard></AdminDashboard>} />
        <Route path="/" element={<MainPage></MainPage>} />
        <Route path="/exam/:testId" element={<ExamPage />} />
      </Routes>
    </div>
  );
}
