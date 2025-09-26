import React, { useEffect } from "react";
import { useChat } from "../../context/ChatContext";

export default function GroupsList({ clubId }) {
  const { groups, fetchGroups, setActiveGroup, connectWS } = useChat();

  useEffect(() => {
    if (clubId) fetchGroups(clubId);
  }, [clubId]);

  const openGroup = (g) => {
    setActiveGroup(g);
    connectWS(g.id);
  };

  return (
    <div className="groups-list">
      {groups.map(g => (
        <div key={g.id} className="group-item" onClick={() => openGroup(g)}>
          <div className="group-name">{g.name}</div>
          {g.is_private && <small>Private</small>}
        </div>
      ))}
    </div>
  )
}
