import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { fetchUsers } from "../../store/reducers/userSlice";
import Header from "../until/Header";

// import "./Contact.scss";

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users);
  const [token, setToken] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      if (users) {
        fetchCurrentUser(storedToken);
      }
    }
  }, [users]);

  const fetchCurrentUser = (token: string) => {
    try {
      const userId = Number(token);
      const user = users.find((user: any) => user.id === userId);
      setCurrentUser(user);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchChatHistory = async (userId: number) => {
    try {
      const chatHistoryRef = doc(db, "chatHistory", userId.toString());
      const docSnap = await getDoc(chatHistoryRef);
      if (docSnap.exists()) {
        setChatHistory(docSnap.data().messages);
      }
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchChatHistory(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      updateChatHistory(messagesData);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const updateChatHistory = async (messagesData: any[]) => {
    if (currentUser) {
      try {
        const chatHistoryRef = doc(
          db,
          "chatHistory",
          currentUser.id.toString()
        );
        const userMessages = messagesData.filter(
          (message) =>
            (message.sender === "Admin" &&
              message.recipient === currentUser.id) ||
            (message.sender === currentUser.username &&
              message.recipient === "Admin")
        );
        await setDoc(chatHistoryRef, { messages: userMessages });
        setChatHistory(userMessages);
      } catch (err) {
        console.error("Error updating chat history:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        await addDoc(collection(db, "messages"), {
          content: newMessage,
          sender: currentUser.username,
          recipient: "Admin",
          timestamp: new Date(),
        });
        setNewMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const handleBackToMainPage = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    if (currentUser && currentUser.role === "admin") {
      navigate("/contact-admin");
    } else {
      navigate("/contact");
    }
  };

  const handleAdminClick = () => {
    if (currentUser && currentUser.role === "admin") {
      navigate(`/admin/${currentUser.role}`);
    }
  };

  const handleUserClick = () => {
    if (currentUser) {
      navigate(`/user-info/${currentUser.id}`);
    }
  };

  const login = () => {
    navigate("/login");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="contact-page">
      <Header
        currentUser={currentUser}
        token={token}
        setCurrentUser={setCurrentUser}
        handleContactClick={handleContactClick}
        handleAdminClick={handleAdminClick}
        handleUserClick={handleUserClick}
        login={login}
        logout={logout}
      />
      <div className="messages-container">
        {/* Display combined chat history */}
        {messages.map((message: any) => (
          <div
            key={message.id}
            className={`message ${
              message.sender === currentUser.username
                ? "user-message"
                : "admin-message"
            }`}
          >
            {message.sender === "Admin" && (
              <span className="sender">Admin:</span>
            )}
            {message.sender === currentUser.username && (
              <span className="sender">{currentUser.username}:</span>
            )}
            <p>{message.content}</p>
            <span className="timestamp">
              {new Date(message.timestamp.seconds * 1000).toDateString()}
            </span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default Contact;

