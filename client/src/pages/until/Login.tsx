import axios from "axios";
import CryptoJS from "crypto-js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.get("http://localhost:3000/account", {
        params: {
          email,
        },
      });

      const account = response.data[0];

      if (account) {
        const decryptedPassword = CryptoJS.DES.decrypt(
          account.password,
          "secret_key"
        ).toString(CryptoJS.enc.Utf8);
        console.log(decryptedPassword);

        if (decryptedPassword === password) {
          localStorage.setItem("token", account.id);
          let timerInterval:any;
          Swal.fire({
            title: "login success",
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              timerInterval = setInterval(() => {

              }, 100);
            },
            willClose: () => {
              clearInterval(timerInterval);
              navigate("/");
            },
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log("I was closed by the timer");
            }
          });

          
          setError("");
        } else {
          setError("Sai mật khẩu");
        }
      } else {
        setError("Sai email hoặc mật khẩu");
      }
    } catch (error) {
      console.error(error);
      setError("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
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
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <button onClick={handleSignupRedirect}>
        Don't have an account? Sign Up
      </button>
    </div>
  );
}

export default Login;
