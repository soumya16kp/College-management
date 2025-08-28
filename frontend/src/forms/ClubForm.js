import { useState } from "react";
import { useClubs } from "../context/ClubContext";
import "./ClubForm.css";

const ClubForm = () => {
  const { addClub } = useClubs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    interest: "",
    location: "",
    schedule: "",
    image: null,
    coursol: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [coursolPreview, setCoursolPreview] = useState(null);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Club name is required";
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.interest.trim()) {
      errors.interest = "Interest category is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
      
      // Create preview for images
      const reader = new FileReader();
      reader.onload = (e) => {
        if (name === "image") {
          setImagePreview(e.target.result);
        } else if (name === "coursol") {
          setCoursolPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const removeImage = (type) => {
    if (type === "image") {
      setFormData(prev => ({ ...prev, image: null }));
      setImagePreview(null);
    } else {
      setFormData(prev => ({ ...prev, coursol: null }));
      setCoursolPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    
    try {
      const uploadData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          uploadData.append(key, formData[key]);
        }
      });

      await addClub(uploadData);
      
      // Reset form on success
      setFormData({
        name: "",
        tagline: "",
        description: "",
        interest: "",
        location: "",
        schedule: "",
        image: null,
        coursol: null,
      });
      setImagePreview(null);
      setCoursolPreview(null);
      setSubmitSuccess(true);
      e.target.reset();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      setSubmitError(error.message || "Failed to create club. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="club-form-container">
      <div className="club-form-header">
        <h2>Create a New Club</h2>
        <p>Fill out the form below to establish your club community</p>
      </div>
      
      <form onSubmit={handleSubmit} className="club-form" encType="multipart/form-data">
        <div className="form-group full-width">
          <label htmlFor="name">Club Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter club name"
            value={formData.name}
            onChange={handleChange}
            className={formErrors.name ? "form-input error" : "form-input"}
          />
          {formErrors.name && (
            <div className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {formErrors.name}
            </div>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="tagline">Tagline</label>
          <input
            type="text"
            id="tagline"
            name="tagline"
            placeholder="Short catchy phrase about your club"
            value={formData.tagline}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your club's purpose, activities, and goals"
            value={formData.description}
            onChange={handleChange}
            className={formErrors.description ? "form-textarea error" : "form-textarea"}
          />
          {formErrors.description && (
            <div className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {formErrors.description}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="interest">Interest Category *</label>
          <input
            type="text"
            id="interest"
            name="interest"
            placeholder="e.g., Coding, Music, Sports"
            value={formData.interest}
            onChange={handleChange}
            className={formErrors.interest ? "form-input error" : "form-input"}
          />
          {formErrors.interest && (
            <div className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {formErrors.interest}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Where does your club meet?"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="schedule">Schedule</label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            placeholder="e.g., Every Friday 5PM"
            value={formData.schedule}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Club Logo/Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="form-file"
          />
          {imagePreview && (
            <div className="file-preview">
              <div className="preview-item">
                <img src={imagePreview} alt="Club preview" />
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeImage("image")}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="coursol">Cover Image (Optional)</label>
          <input
            type="file"
            id="coursol"
            name="coursol"
            accept="image/*"
            onChange={handleChange}
            className="form-file"
          />
          {coursolPreview && (
            <div className="file-preview">
              <div className="preview-item">
                <img src={coursolPreview} alt="Cover preview" />
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => removeImage("coursol")}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className={isSubmitting ? "submit-btn loading" : "submit-btn"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Club..." : "Create Club"}
        </button>

        {submitError && (
          <div className="form-error full-width">
            <i className="fas fa-exclamation-circle"></i>
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="form-success full-width">
            <i className="fas fa-check-circle"></i>
            Club created successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default ClubForm;