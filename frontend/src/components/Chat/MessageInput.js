import React, { useState } from "react";
import { useChat } from "../../context/ChatContext";

export default function MessageInput({ onSend, groupId }) {
  const [text, setText] = useState("");
  const { uploadMessageFile } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // upload via REST - returns created message object
    await uploadMessageFile(groupId, file, file.type.startsWith("image/"));
    // server will return message and consumer may broadcast — also you may fetch new messages
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message..." />
      <input type="file" onChange={handleFile} />
      <button type="submit">Send</button>
    </form>
  );
}
