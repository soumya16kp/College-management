import { useUser } from "../context/UserContext";
import AccountForm from "../forms/AccountForm";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { logout } from "../store/AuthSlice";

const AccountPage = () => {
  const { user, loading } = useUser();
  const dispatch = useDispatch();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user data available.</p>;

   const handleLogout=async ()=>{
    try{
      await authService.logout();
      dispatch(logout);
    }
    catch(error){
      console.error(error);
    }

  }

  return (
    <div>
      <h2>Account Page</h2>
      {user.profile_image && (
        <img
          src={`http://127.0.0.1:8000${user.profile_image}`}
          alt="Profile"
          width={120}
        />
      )}
      <p><strong>User:</strong> {user.user.username}</p>
      <p><strong>Email:</strong> {user.user.email}</p>
      <p><strong>Bio:</strong> {user.bio}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Designation:</strong> {user.designation}</p>

      <h3>Edit Profile</h3>
      <AccountForm />

    <button
      onClick={handleLogout}
    >
      Logout
    </button>
    </div>
  );
};

export default AccountPage;
