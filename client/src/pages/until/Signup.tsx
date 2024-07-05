import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.scss";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/account");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        setError("Email đã tồn tại");
        return;
      }

      const maxId =
        users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;
      const newId = maxId + 1;

      const encryptedPassword = CryptoJS.DES.encrypt(
        password,
        "secret_key"
      ).toString();
      const defaultTestHistory: any = [];

      await axios.post("http://localhost:3000/account", {
        id: newId,
        username,
        email,
        password: encryptedPassword,
        testHistory: defaultTestHistory,
      });

      alert("Đăng ký thành công");
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Create Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={handleLoginRedirect}>
        Already have an account? Login
      </button>
    </div>
  );
};

export default Signup;
