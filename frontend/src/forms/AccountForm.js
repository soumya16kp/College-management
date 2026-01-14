import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import userService from "../services/userservice";
import "./AccountForm.css";

const AccountForm = ({ onCancel }) => {
  // Use 'profile' and 'setProfile' to match the updated Context
  const { profile, setProfile } = useUser();
  
  const [formData, setFormData] = useState({
    bio: profile?.bio || "",
    phone: profile?.phone || "",
    designation: profile?.designation || "",
    profile_image: null,
  });

  // This ensures the form updates if the profile data finishes loading after the component mounts
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        phone: profile.phone || "",
        designation: profile.designation || "",
        profile_image: null,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // When sending files (profile_image), you MUST use FormData
    const data = new FormData();
    data.append("bio", formData.bio);
    data.append("phone", formData.phone);
    data.append("designation", formData.designation);
    if (formData.profile_image) {
      data.append("profile_image", formData.profile_image);
    }

    try {
      const updatedProfile = await userService.updateProfile(data);
      setProfile(updatedProfile); // Update global state
      alert("Profile updated successfully!");
      if (onCancel) onCancel(); // Close the form after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone number"
        />
      </div>

      <div className="form-group">
        <label>Designation</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Your designation"
        />
      </div>

      <div className="form-group">
        <label>Profile Image</label>
        <input 
          type="file" 
          name="profile_image" 
          onChange={handleFileChange} 
          accept="image/*"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">
          Save Changes
        </button>
        {onCancel && (
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AccountForm;