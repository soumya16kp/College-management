import { useUser } from "../context/UserContext";
import AccountForm from "../forms/AccountForm";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { logout } from "../store/AuthSlice";
import { useState } from "react";
import "./Account.css"; // ✅ import CSS

const AccountPage = () => {
  const { user, loading } = useUser();
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [editUser, setEditUser] = useState(false);

  const editingToggle = () =>{
    setEditing(!editing);
  }
  const editUserToggle = () => setEditUser(!editUser);

  if (loading) return <p className="loading">Loading...</p>;
  if (!user) return <p className="no-user">No user data available.</p>;

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout()); // ✅ fixed
    } catch (error) {
      console.error(error);
    }
  };
  console.log(user);
  return (

    <>
      {editUser && (
        <div className="account-form-popup">
          <div className="account-form">
            <h3 className="edit-title">Edit Profile</h3>
            <span className="close-btn" onClick={editUserToggle}>
              &times;
            </span>
            <AccountForm user={user} onClose={editUserToggle} />
          </div>
        </div>
      )}
      <div className="account-container">
      <h2 className="account-title">Account</h2>
      <div className="edit-btn">
        <i className="fa-solid fa-ellipsis-vertical" onClick={editingToggle}></i>
        {editing && (
          <div className="edit-options">
            <button onClick={editUserToggle}>Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      {user.profile_image && (
        <img
          src={`${user.profile_image}`}
          alt="Profile"
          className="profile-img"
        />
      )}

      <div className="account-info">
        <p><strong>Username:</strong> {user.user.username}</p>
        <p><strong>Email:</strong> {user.user.email}</p>
        <p><strong>Bio:</strong> {user.bio || "Not provided"}</p>
        <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
        <p><strong>Designation:</strong> {user.designation || "Not provided"}</p>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
    </>
  );
};

export default AccountPage;
