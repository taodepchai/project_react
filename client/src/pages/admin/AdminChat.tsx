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
// import "./AdminChat.scss";

const AdminChat: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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
    if (selectedUser) {
      fetchChatHistory(selectedUser.id);
    }
  }, [selectedUser]);

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
  }, []);

  const updateChatHistory = async (messagesData: any[]) => {
    if (selectedUser) {
      try {
        const chatHistoryRef = doc(
          db,
          "chatHistory",
          selectedUser.id.toString()
        );
        await setDoc(chatHistoryRef, { messages: messagesData });
      } catch (err) {
        console.error("Error updating chat history:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && selectedUser) {
      try {
        await addDoc(collection(db, "messages"), {
          content: newMessage,
          sender: "Admin",
          recipient: selectedUser.id,
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
    <div className="admin-chat-page">
      <div className="header">
        <h1>Admin Chat</h1>
        <button onClick={handleBackToMainPage}>Quay lại</button>
      </div>
      <div className="user-selection">
        <h2>Select User</h2>
        <select
          value={selectedUser ? selectedUser.id : ""}
          onChange={(e) => {
            const userId = Number(e.target.value);
            const user = users.find((user: any) => user.id === userId);
            setSelectedUser(user);
          }}
        >
          <option value="">Select User</option>
          {users.map((user: any) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div className="messages-container">
        {messages
          .filter((message: any) => message.recipient === selectedUser.id)
          .map((message: any) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === "Admin"
                  ? "admin-message"
                  : "user-message"
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

export default AdminChat;

