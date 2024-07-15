import React from "react";
import { useNavigate } from "react-router-dom";
// import "./Header.scss";

interface Props {
  currentUser: any;
  token: string | null;
  setCurrentUser: (user: any) => void;
  handleContactClick: () => void;
  handleAdminClick: () => void;
  handleUserClick: () => void;
  login: () => void;
  logout: () => void;
}

const Header: React.FC<Props> = ({
  currentUser,
  token,
  setCurrentUser,
  handleContactClick,
  handleAdminClick,
  handleUserClick,
  login,
  logout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <h1>90% câu hỏi trả lời trong 10 phút</h1>
      <button onClick={handleContactClick}>Hỏi ngay</button>
      {token ? (
        <button onClick={logout}>Đăng xuất</button>
      ) : (
        <button onClick={login}>Đăng nhập</button>
      )}
      {currentUser && (
        <div className="user-info" onClick={handleUserClick}>
          <div className="user-avatar">
            <img
              src={currentUser.avtUrl}
              alt={`${currentUser.username}'s avatar`}
            />
            <p>{currentUser.username}</p>
          </div>
        </div>
      )}
      {currentUser && currentUser.role === "admin" && (
        <button onClick={handleAdminClick}>Admin</button>
      )}
    </div>
  );
};

export default Header;

