import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBell, FiInfo } from 'react-icons/fi';
import authService from '../services/authService';
import './Notices.css';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        is_important: false,
        role: 'official'
    });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const response = await authService.apiClient.get('/clubs/notices/');
            setNotices(response.data);
        } catch (error) {
            console.error('Error fetching notices:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNotice) {
                await authService.apiClient.put(`/clubs/notices/${editingNotice.id}/`, formData);
            } else {
                await authService.apiClient.post('/clubs/notices/', formData);
            }
            fetchNotices();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving notice:', error);
            alert(error.response?.data?.detail || 'Error saving notice');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            try {
                await authService.apiClient.delete(`/clubs/notices/${id}/`);
                fetchNotices();
            } catch (error) {
                console.error('Error deleting notice:', error);
            }
        }
    };

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        setFormData({
            title: notice.title,
            content: notice.content,
            is_important: notice.is_important,
            role: notice.role
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingNotice(null);
        setFormData({ title: '', content: '', is_important: false, role: 'official' });
    };

    return (
        <div className="notices-page">
            <div className="notices-header">
                <h1>Notice Board</h1>
                <button className="add-notice-btn" onClick={() => setShowModal(true)}>
                    <FiPlus /> <span>Add Notice</span>
                </button>
            </div>

            <div className="notices-grid">
                {notices.map(notice => (
                    <div key={notice.id} className={`notice-card ${notice.is_important ? 'important' : ''}`}>
                        <div className="notice-card-header">
                            <div className="notice-icon">
                                {notice.is_important ? <FiBell /> : <FiInfo />}
                            </div>
                            <div className="notice-actions">
                                <button onClick={() => handleEdit(notice)}><FiEdit2 /></button>
                                <button onClick={() => handleDelete(notice.id)}><FiTrash2 /></button>
                            </div>
                        </div>
                        <h3>{notice.title}</h3>
                        <p>{notice.content}</p>
                        <div className="notice-footer">
                            <span className={`notice-badge badge-${notice.role}`}>{notice.role}</span>
                            <span className="notice-date">{new Date(notice.date_posted).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingNotice ? 'Edit Notice' : 'Create Notice'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="official">Official</option>
                                    <option value="club">Club</option>
                                    <option value="event">Event</option>
                                </select>
                            </div>
                            <div className="form-group-checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_important}
                                        onChange={(e) => setFormData({ ...formData, is_important: e.target.checked })}
                                    />
                                    Mark as Important
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit">{editingNotice ? 'Save' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;
