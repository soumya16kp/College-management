import { useState } from "react";
import authService from "../services/authService";
import { FiUpload, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import { MdCloudUpload } from "react-icons/md";
import './GalleryForm.css'

const GalleryForm = ({ eventId, onUploadSuccess, onCancel }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please select at least one image");
      return;
    }

    setUploading(true);
    setError("");

    try {
      await Promise.all(
        images.map((img) => {
          const formData = new FormData();
          formData.append("image", img);
          formData.append("event", eventId);

          return authService.apiClient.post("/gallery/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        })
      );

      setImages([]);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="gallery-modal-overlay">
      <form onSubmit={handleSubmit} className="gallery-form">
        <div className="form-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            <MdCloudUpload className="form-icon" />
            <h4 className="form-title">Upload Event Images</h4>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096' }}
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="file-input-container">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
            id={`file-input-${eventId}`}
            disabled={uploading}
          />
          <label htmlFor={`file-input-${eventId}`} className="file-input-label">
            <FiUpload className="label-icon" />
            Choose Images
          </label>
          {images.length > 0 && (
            <span className="file-count">
              <FiCheck className="count-icon" />
              {images.length} file(s) selected
            </span>
          )}
        </div>

        {images.length > 0 && (
          <div className="selected-files">
            <h5>Selected Files:</h5>
            {images.map((image, index) => (
              <div key={index} className="file-item">
                <span className="file-name">{image.name}</span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="remove-file-btn"
                  disabled={uploading}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="error-message">
            <FiAlertCircle className="error-icon" />
            {error}
          </div>
        )}

        <button
          type="submit"
          className="upload-button"
          disabled={uploading || images.length === 0}
        >
          {uploading ? (
            <>
              <div className="spinner"></div>
              Uploading...
            </>
          ) : (
            <>
              <FiUpload className="btn-icon" />
              Upload Images
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default GalleryForm;