import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import authService from "../services/authService";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]); // for active group
  const wsRef = useRef(null);

  const fetchGroups = async (clubId) => {
    const res = await authService.apiClient.get(`/clubs/${clubId}/groups/`);
    setGroups(res.data);
  };

  const fetchMessages = async (groupId) => {
    const res = await authService.apiClient.get(`/groups/${groupId}/messages/`);
    setMessages(res.data);
  };

  const createGroup = async (clubId, payload) => {
    const res = await authService.apiClient.post(`/clubs/${clubId}/groups/`, payload);
    setGroups(prev => [res.data, ...prev]);
    return res.data;
  };

  const addMemberToGroup = async (groupId, userId) => {
    return await authService.apiClient.post(`/groups/${groupId}/members/`, { user_id: userId });
  };

  const removeMemberFromGroup = async (groupId, userId) => {
    return await authService.apiClient.delete(`/groups/${groupId}/members/`, { data: { user_id: userId }});
  };

  const uploadMessageFile = async (groupId, file,text,isImage=false) => {
    const fd = new FormData();
    if (isImage) fd.append("image", file);
    else fd.append("file", file);
    // other fields can be appended
    fd.append("text", text);
    const res = await authService.apiClient.post(`/groups/${groupId}/messages/`, fd, {
      headers: {"Content-Type":"multipart/form-data"}
    });
    return res.data;
  };

  const pinMessage = async (messageId) => {
    return await authService.apiClient.post(`/messages/${messageId}/pin/`);
  };

  const deleteMessage = async (messageId) => {
    return await authService.apiClient.delete(`/messages/${messageId}/`);
  };

  // WebSocket helpers
const connectWS = (groupId) => {
  
  if (wsRef.current) wsRef.current.close();

  const token = localStorage.getItem("token");
  console.log("🔑 Token from localStorage before WS connect:", token);

  const baseWs = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${baseWs}://${window.location.hostname}:8000/ws/chat/groups/${groupId}/?token=${token}`;
  console.log("🌐 Connecting to WebSocket URL:", wsUrl);

  const ws = new WebSocket(wsUrl);
  ws.onopen = () => console.log("✅ chat ws open", groupId);
  ws.onclose = () => console.log("❌ chat ws closed");
  ws.onerror = (e) => console.error("⚠️ ws error", e);

  ws.onmessage = (event) => {
    console.log("📨 MESSAGE RECEIVED FROM SERVER:", event.data);
    const data = JSON.parse(event.data);
    if (data.type === 'new_message') {
      
      setMessages(prevMessages => [...prevMessages, data]);
    }
  };

  wsRef.current = ws;
};


const sendWSMessage = (payload) => {
  if (!wsRef.current) {
    console.error("❌ Cannot send message, wsRef is not set!");
    return;
  }

  if (wsRef.current.readyState !== WebSocket.OPEN) {
    console.error(`❌ Cannot send message, WebSocket is not open. Current state: ${wsRef.current.readyState}`);
    // readyState values: 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
    return;
  }

  console.log("✅ Sending message:", payload);
  wsRef.current.send(JSON.stringify(payload));
};

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <ChatContext.Provider value={{
      groups, fetchGroups, createGroup, addMemberToGroup, removeMemberFromGroup,
      activeGroup, setActiveGroup, fetchMessages, messages, connectWS, sendWSMessage,
      uploadMessageFile, pinMessage, deleteMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
