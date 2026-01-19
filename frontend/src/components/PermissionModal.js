import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';
import './PermissionModal.css';

const PermissionModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="permission-modal-overlay" onClick={onClose}>
            <div className="permission-modal-content" onClick={e => e.stopPropagation()}>
                <button className="permission-modal-close" onClick={onClose}>
                    <FiX />
                </button>

                <div className="permission-modal-icon-container">
                    <FiAlertCircle className="permission-modal-icon" />
                </div>

                <h3 className="permission-modal-title">Access Restricted</h3>
                <p className="permission-modal-message">{message}</p>

                <button className="permission-modal-action-btn" onClick={onClose}>
                    Understood
                </button>
            </div>
        </div>
    );
};

export default PermissionModal;
