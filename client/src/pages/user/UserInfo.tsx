import axios from "axios";
import CryptoJS from "crypto-js";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../config/firebase";
import { TestHistory, User } from "../../interface/types";
import { fetchUsers } from "../../store/reducers/userSlice";
import "./UserInfo.scss";

const UserInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users);
  const { userId } = useParams<{ userId: string }>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // Add state for current password
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchCurrentUser(storedToken);
    }
  }, [users]);

  const fetchCurrentUser = (token: string) => {
    try {
      const userId = Number(token);
      const user = users.find((user: User) => user.id === userId);
      setCurrentUser(user || null);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const handleBackToMainPage = () => {
    navigate("/");
  };

  const handleShowChangePasswordForm = () => {
    setShowChangePasswordForm(!showChangePasswordForm);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name === "currentPassword") {
      setCurrentPassword(value);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const decryptedCurrentPassword = CryptoJS.DES.decrypt(
        currentUser?.password || "",
        "secret_key"
      ).toString(CryptoJS.enc.Utf8);

      if (decryptedCurrentPassword !== currentPassword) {
        setError("Incorrect current password");
        return;
      }

      const encryptedPassword = CryptoJS.DES.encrypt(
        newPassword,
        "secret_key"
      ).toString();

      const updatedUser = {
        ...currentUser,
        password: encryptedPassword,
      };

      await axios.put(`http://localhost:3000/account/${currentUser?.id}`, updatedUser);

      setCurrentUser(updatedUser as User);
      alert("Password changed successfully");
      setShowChangePasswordForm(false);
      setError("");
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to change password");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) {
      alert("Please select an image file");
      return;
    }

    const storageRef = ref(storage, `avatars/${currentUser?.id}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading avatar:", error);
        alert("Error uploading avatar");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            avtUrl: downloadURL,
          };
          await axios.put(`http://localhost:3000/account/${currentUser.id}`, updatedUser);
          setCurrentUser(updatedUser);
          alert("Avatar updated successfully");
        }
      }
    );
  };

  return (
    <div className="user-info-page">
      <div className="header">
        <button onClick={handleBackToMainPage}>Back to Main Page</button>
      </div>
      {currentUser ? (
        <div className="user-details">
          <div className="user-avatar">
            <img
              src={currentUser.avtUrl}
              alt={`${currentUser.username}'s avatar`}
            />
          </div>
          <div className="user-info">
            <h2>{currentUser.username}</h2>
            <p>Email: {currentUser.email}</p>
            <h3>Exam History</h3>
            <ul>
              {currentUser.testHistory.map((exam: TestHistory) => (
                <li key={exam.testId}>
                  Exam {exam.testId}: {exam.testName} - Start Time:{" "}
                  {exam.startTime}, End Time: {exam.endTime}, Score:{" "}
                  {(exam.score / 100) * 10}/10
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>Loading user information...</div>
      )}
      <button onClick={handleShowChangePasswordForm}>Change Password</button>
      {showChangePasswordForm && (
        <div className="change-password-form">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={currentPassword}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleInputChange}
          />
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUploadAvatar}>Upload Avatar</button>
      {uploadProgress > 0 && <p>Upload progress: {uploadProgress}%</p>}
    </div>
  );
};

export default UserInfo;
