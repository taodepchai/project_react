import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { User } from "../../interface/types";
import { fetchUsers, createUser, updateUser, removeUser } from "../../store/slice/userSlice";
import "./UserManagement.scss";

Modal.setAppElement("#root");

const UserManagement: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users); 
  const loading = useSelector((state: any) => state.user.loading);
  const error = useSelector((state: any) => state.user.error);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  
  
  const currentUsers = Array.isArray(users) ? users.slice(indexOfFirstUser, indexOfLastUser) : []; 

  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setCurrentUser(user);
      setIsEditing(true);
    } else {
      setCurrentUser(
        Object.assign({}, user, {
        username: "",
        email: "",
        password: "",
        testHistory: []  
      }));
      setIsEditing(false);
    }
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setCurrentUser(null);
    setIsEditing(false);
  };

  const handleSaveUser = async () => {
    if (currentUser) {
      if (isEditing) {
        dispatch(updateUser(currentUser));
      } else {
        dispatch(createUser(currentUser));
      }
      handleCloseModal();
    }
  };

  const handleDeleteUser = async (id: number) => {
    dispatch(removeUser(id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };
  return (
    <div>
      <h2>User Manager</h2>
      <button onClick={() => handleOpenModal()}>Add User</button>
      <ul>
        {currentUsers.map((user:User) => (
          <li key={user.id}>
            <div>
              <strong>Username:</strong> {user.username}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Test History:</strong>
              <ul>
                {user.testHistory?.map((test, index) => (
                  <li key={index}>
                    <div>
                      <strong>Test Name:</strong> {test.testName}
                    </div>
                    <div>
                      <strong>Start Time:</strong> {new Date(test.startTime).toLocaleString()}
                    </div>
                    <div>
                      <strong>End Time:</strong> {new Date(test.endTime).toLocaleString()}
                    </div>
                    <div>
                      <strong>Score:</strong> {test.score}
                    </div>
                  </li>
                ))} 
              </ul>
            </div>
            <button onClick={() => handleOpenModal(user)}>Edit</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map((number) => (
          <button key={number} onClick={() => paginate(number + 1)}>
            {number + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal} contentLabel="User Modal">
        <h2>{isEditing ? "Edit User" : "Add User"}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={currentUser?.username || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={currentUser?.email || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={currentUser?.password || ""}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSaveUser}>{isEditing ? "Save Changes" : "Add User"}</button>
          <button onClick={handleCloseModal}>Cancel</button>
        </form>
      </Modal>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default UserManagement;
