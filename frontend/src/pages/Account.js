import { useUser } from "../context/UserContext";
import AccountForm from "../forms/AccountForm";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { logout } from "../store/AuthSlice";
import "./Account.css"; // ✅ import CSS

const AccountPage = () => {
  const { user, loading } = useUser();
  const dispatch = useDispatch();

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

  return (
    <div className="account-container">
      <h2 className="account-title">Account</h2>

      {user.profile_image && (
        <img
          src={`http://127.0.0.1:8000${user.profile_image}`}
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

      <h3 className="edit-title">Edit Profile</h3>
      <AccountForm />

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AccountPage;
