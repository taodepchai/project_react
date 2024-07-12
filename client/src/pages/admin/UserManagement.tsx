import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../interface/types";
import {
  createUser,
  fetchUsers,
  updateUser,
} from "../../store/reducers/userSlice";
import "./UserManagement.scss";

Modal.setAppElement("#root");

const UserManagement: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users) || [];
  const loading = useSelector((state: any) => state.user.loading);
  const error = useSelector((state: any) => state.user.error);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setCurrentUser(user);
      setIsEditing(true);
    } else {
      setCurrentUser({
        id: 0,
        username: "",
        email: "",
        password: "",
        avtUrl:
          "https://firebasestorage.googleapis.com/v0/b/test-f9878.appspot.com/o/bc439871417621836a0eeea768d60944.jpg?alt=media&token=be7e21a7-d6a5-4916-ae3a-67e53b00d209",
        testHistory: [],
        status: 1,
        role: "user",
      });
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

  const handleBlockUser = async (id: number) => {
    const userToBlock = users.find((user: User) => user.id === id);
    if (userToBlock) {
      const updatedUser = {
        ...userToBlock,
        status: userToBlock.status === 1 ? 0 : 1,
      };
      dispatch(updateUser(updatedUser));
    }
  };

  const handleToggleRole = async (id: number) => {
    const userToUpdate = users.find((user: User) => user.id === id);
    if (userToUpdate) {
      const updatedUser = {
        ...userToUpdate,
        role: userToUpdate.role === "admin" ? "user" : "admin",
      };
      dispatch(updateUser(updatedUser));
    }
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
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user: User) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.status === 1 ? "Active" : "Blocked"}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleOpenModal(user)}>Detail</button>
                <button onClick={() => handleBlockUser(user.id)}>
                  {user.status === 1 ? "Block" : "Unblock"}
                </button>
                <button onClick={() => handleToggleRole(user.id)}>
                  {user.role === "admin"
                    ? "Demote to User"
                    : "Promote to Admin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(
          (number) => (
            <button key={number} onClick={() => paginate(number + 1)}>
              {number + 1}
            </button>
          )
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="User Modal"
      >
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
          <button onClick={handleSaveUser}>
            {isEditing ? "Save Changes" : "Add User"}
          </button>
          <button onClick={handleCloseModal}>Cancel</button>
        </form>
      </Modal>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default UserManagement;
