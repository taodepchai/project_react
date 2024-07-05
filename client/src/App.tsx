import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/until/Login";
import Signup from "./pages/until/Signup";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login></Login>} />
        <Route path="/signup" element={<Signup></Signup>} />
        <Route path="/admin" element={<AdminDashboard></AdminDashboard>} />
      </Routes>
    </div>
  );
}
