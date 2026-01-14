import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useMembers } from '../../context/MemberContext';
import { useUser } from "../../context/UserContext";

import { 
  FiMessageCircle, 
  FiUsers, 
  FiLock, 
  FiGlobe, 
  FiPlus, 
  FiSend,
  FiPaperclip,
  FiTrash2,
  FiSettings,
  FiUserPlus,
  FiUserMinus
} from 'react-icons/fi';
import { MdGroups, MdChat, MdAdminPanelSettings,MdPushPin } from 'react-icons/md';
import './Contact.css';

const Contact = () => {
  const { id: clubId } = useParams();
  const { 
    groups, 
    fetchGroups, 
    createGroup, 
    activeGroup, 
    setActiveGroup, 
    messages, 
    fetchMessages, 
    connectWS, 
    sendWSMessage,
    uploadMessageFile,
    pinMessage,
    deleteMessage,
    addMemberToGroup,
    removeMemberFromGroup
  } = useChat();
  
  const { members, userRole } = useMembers();
  const [newMessage, setNewMessage] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: '', is_private: false, members: [] });
  const [fileUpload, setFileUpload] = useState(null);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const{user}=useUser();
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (clubId) {
      fetchGroups(clubId);
    }
  }, [clubId]);

const [fetchedGroups, setFetchedGroups] = useState(new Set());

useEffect(() => {
  if (!activeGroup) return;
 
  if (fetchedGroups.has(activeGroup.id)) return;

  fetchMessages(activeGroup.id);

  connectWS(activeGroup.id);
 
  // Mark this group as fetched
  setFetchedGroups(prev => new Set(prev).add(activeGroup.id));
}, [activeGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {

  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await createGroup(clubId, newGroupData);
      setShowCreateGroup(false);
      setNewGroupData({ name: '', is_private: false, members: [] });
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !fileUpload) return;

    try {
      if (fileUpload) {
        const isImage = fileUpload.type.startsWith('image/');
        await uploadMessageFile(activeGroup.id, fileUpload, newMessage, isImage);
        setFileUpload(null);
      } else {
        sendWSMessage({
       
          type: 'send_message',
          text: newMessage,
          group_id: activeGroup.id
        });
      }
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handlePinMessage = async (messageId) => {
    try {
      await pinMessage(messageId);
    } catch (error) {
      console.error('Failed to pin message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await addMemberToGroup(activeGroup.id, userId);
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeMemberFromGroup(activeGroup.id, userId);
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const canManageGroup = (group) => {
    return userRole && ['admin', 'president', 'secretary'].includes(userRole);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
          <div className="chat-header">
        <div className="chat-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MdChat className="chat-header-icon" />
            <div>
              <h1>Club Chat</h1>
              <p style={{ margin: 0, color: '#718096' }}>Connect and collaborate with club members</p>
            </div>
          </div>
          <div className="group-actions">
            {canManageGroup() && (
              <button 
                className="create-group-btn"
                onClick={() => setShowCreateGroup(true)}
              >
                <FiPlus style={{ marginRight: '0.5rem' }} />
                Create Group
              </button>
            )}
          </div>
        </div>
      </div>
    
    <div className="chat-page-container">

      {/* Groups Sidebar */}
      <div className="groups-sidebar">
        <div className="groups-header">
          <h2 className="groups-title">Chat Groups</h2>
        </div>
        
        <div className="groups-list">
          {groups.map(group => (
            <div 
              key={group.id}
              className={`group-item ${group.is_private ? 'private' : ''} ${activeGroup?.id === group.id ? 'active' : ''}`}
              onClick={() => setActiveGroup(group)}
            >
              <div className="group-header">
                <h3 className="group-name">
                  {group.is_private ? <FiLock size={16} /> : <FiGlobe size={16} />}
                  {group.name}
                </h3>
                <span className={`group-privacy ${group.is_private ? 'private' : 'public'}`}>
                  {group.is_private ? 'Private' : 'Public'}
                </span>
              </div>
              <div className="group-members">
                <FiUsers size={14} />
                {group.members_count} members
              </div>
              {group.created_by.username && (
                <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '0.5rem' }}>
                  Created by {group.created_by.username}
                </div>
              )}
            </div>
          ))}
          
          {groups.length === 0 && (
            <div className="empty-state">
              <MdGroups className="empty-state-icon" />
              <p>No chat groups yet</p>
              {canManageGroup() && (
                <button 
                  className="create-group-btn"
                  onClick={() => setShowCreateGroup(true)}
                  style={{ marginTop: '1rem' }}
                >
                  Create First Group
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {activeGroup ? (
          <>
            {/* Chat Header */}
            <div className="chat-area-header">
              <div className="current-group-info">
                <div className="group-title-section">
                  <h2>
                    {activeGroup.is_private ? <FiLock size={20} /> : <FiGlobe size={20} />}
                    {activeGroup.name}
                  </h2>
                  <div className="group-meta">
                    <span>{activeGroup.members_count} members</span>
                    <span>•</span>
                    <span>{activeGroup.is_private ? 'Private Group' : 'Public Group'}</span>
                  </div>
                </div>
                <div className="group-actions">
                  {(canManageGroup(activeGroup) || activeGroup.created_by === user.id) && (
                    <button 
                      className="group-action-btn"
                      onClick={() => setShowGroupSettings(true)}
                    >
                      <FiSettings />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {messages.filter(m => !m.deleted).map(message => (
                
                <div key={message.id} className={`message ${message.sender.id === user.id ? 'own' : ''} ${message.pinned ? 'pinned' : ''}`}>
                  <div className="message-avatar">
                  {console.log(message)}
                    {getInitials(message.sender.username)}
                  </div>
                  <div className="message-content">
                    {message.pinned && (
                      <div className="pinned-indicator">
                        <FiPaperclip /> Pinned Message
                      </div>
                    )}
                    <div className="message-header">
                      <span className="message-sender">{message.sender.username}</span>
                      <span className="message-time">{formatTime(message.created_at)}</span>
                    </div>
                    
                    {message.text && <p className="message-text">{message.text}</p>}
                    
                    {message.file && (
                      <a href={`${BASE_URL}${message.file}`} target="_blank" rel="noopener noreferrer">
                        Download File
                      </a>
                    )}
                    
                    {message.image && (
                      <div className="message-file">
                        <img
                          src={`${BASE_URL}${message.image}`}
                          alt="Shared"
                          style={{ maxWidth: '200px', borderRadius: '8px' }}
                        />
                      </div>
                    )}


                    <div className="message-actions">
                      {(message.sender.id === user.id || canManageGroup(activeGroup)) && (
                        <>
                          <button 
                            className="message-action-btn"
                            onClick={() => handlePinMessage(message.id)}
                            title="Pin/Unpin message"
                          >
                            <MdPushPin />
                          </button>
                          <button 
                            className="message-action-btn"
                            onClick={() => handleDeleteMessage(message.id)}
                            title="Delete message"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <form onSubmit={handleSendMessage} className="message-input-form">
                <div style={{ position: 'relative', flex: 1 }}>
                  <textarea
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    style={{ minHeight: '50px', maxHeight: '120px' }}
                  />
                  {fileUpload && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '100%', 
                      left: 0, 
                      background: 'rgba(255,255,255,0.9)',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      fontSize: '0.8rem'
                    }}>
                      📎 {fileUpload.name}
                      <button 
                        type="button"
                        onClick={() => setFileUpload(null)}
                        style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                
                <label className="file-upload-btn">
                  <FiPaperclip />
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => setFileUpload(e.target.files[0])}
                  />
                </label>
                
                <button type="submit" className="send-btn" disabled={!newMessage.trim() && !fileUpload}>
                  <FiSend />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MdChat className="empty-state-icon" />
            <h3>Select a chat group</h3>
            <p>Choose a group from the sidebar to start chatting</p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="modal-overlay" onClick={() => setShowCreateGroup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Group Name</label>
                <input
                  type="text"
                  value={newGroupData.name}
                  onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newGroupData.is_private}
                    onChange={(e) => setNewGroupData({ ...newGroupData, is_private: e.target.checked })}
                  />
                  Private Group (Members by invitation only)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Settings Modal */}
      {showGroupSettings && activeGroup && (
        <div className="modal-overlay" onClick={() => setShowGroupSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Group Settings - {activeGroup.name}</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3>Manage Members</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {members.filter(m => m.status === 'approved').map(member => (
                  <div key={member.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <span>{member.user.username}</span>
                    <div>
                      {activeGroup.members.includes(member.user.id) ? (
                        <button 
                          onClick={() => handleRemoveMember(member.user.id)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          <FiUserMinus /> Remove
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAddMember(member.user.id)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          <FiUserPlus /> Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowGroupSettings(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Contact;