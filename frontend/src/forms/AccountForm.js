import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import userService from "../services/userservice";
import "./AccountForm.css"; // ✅ new CSS file

const AccountForm = () => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    phone: user?.phone || "",
    designation: user?.designation || "",
    profile_image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await userService.updateProfile(formData);
      setUser(updated);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      <label>
        Bio
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
        />
      </label>

      <label>
        Phone
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone number"
        />
      </label>

      <label>
        Designation
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Your designation"
        />
      </label>

      <label>
        Profile Image
        <input type="file" name="profile_image" onChange={handleFileChange} />
      </label>

      <button type="submit" className="save-btn">
        Save Changes
      </button>
    </form>
  );
};

export default AccountForm;
