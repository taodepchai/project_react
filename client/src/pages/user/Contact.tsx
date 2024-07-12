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
// import "./Contact.scss";

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

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
        await setDoc(chatHistoryRef, { messages: messagesData });
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
          recipient: currentUser.id,
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

  return (
    <div className="contact-page">
      <div className="header">
        <h1>Hỏi đáp</h1>
        <button onClick={handleBackToMainPage}>Quay lại</button>
      </div>
      <div className="messages-container">
        {chatHistory.length > 0 && (
          <>
            {chatHistory.map((message: any) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === currentUser.username
                    ? "user-message"
                    : "admin-message"
                }`}
              >
                <p>{message.content}</p>
                <span className="timestamp">
                  {new Date(message.timestamp.seconds * 1000).toDateString()}
                </span>
              </div>
            ))}
          </>
        )}
        {messages
          .filter((message: any) => message.recipient === currentUser.id)
          .map((message: any) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === currentUser.username
                  ? "user-message"
                  : "admin-message"
              }`}
            >
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
