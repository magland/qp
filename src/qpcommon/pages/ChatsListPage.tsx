import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chat } from "../types";
import { listChats, deleteChat } from "../interface/interface";

interface ChatsListPageProps {
  width: number;
  height: number;
}

const ChatsListPage: FunctionComponent<ChatsListPageProps> = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState<string>("");
  const [showAdminKeyInput, setShowAdminKeyInput] = useState<boolean>(false);
  const navigate = useNavigate();

  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedChats = await listChats();
      setChats(fetchedChats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const handleDeleteClick = useCallback((chatId: string) => {
    setDeletingChatId(chatId);
    setShowAdminKeyInput(true);
    // Load admin key from localStorage if it exists
    const savedAdminKey = localStorage.getItem('qp-admin-key');
    setAdminKey(savedAdminKey || "");
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeletingChatId(null);
    setShowAdminKeyInput(false);
    setAdminKey("");
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingChatId || !adminKey.trim()) {
      return;
    }

    try {
      await deleteChat(deletingChatId, adminKey.trim());
      // Save admin key to localStorage for future use
      localStorage.setItem('qp-admin-key', adminKey.trim());
      setDeletingChatId(null);
      setShowAdminKeyInput(false);
      setAdminKey("");
      // Reload the chats list
      await loadChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chat");
      setDeletingChatId(null);
      setShowAdminKeyInput(false);
      setAdminKey("");
    }
  }, [deletingChatId, adminKey, loadChats]);

  const handleChatClick = useCallback((chatId: string) => {
    navigate(`/qp/chat/${chatId}`);
  }, [navigate]);

  const handleNewChat = useCallback(() => {
    navigate("/qp/chat");
  }, [navigate]);

  const formatDate = (date?: Date) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    return d.toLocaleString();
  };

  const getFirstUserMessage = (chat: Chat): string => {
    const firstUserMsg = chat.messages.find(msg => msg.role === 'user');
    if (!firstUserMsg) return "No messages";
    const content = firstUserMsg.content;
    return content.length > 100 ? content.substring(0, 100) + "..." : content;
  };

  if (loading) {
    return (
      <div className="chats-list-container">
        <div className="chats-list-loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chats-list-container">
      <div className="chats-list-header">
        <h1>All Chats</h1>
        <button onClick={handleNewChat} className="new-chat-button">
          + New Chat
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {chats.length === 0 ? (
        <div className="no-chats-message">
          No chats found. <button onClick={handleNewChat} className="inline-link-button">Start a new chat</button>
        </div>
      ) : (
        <div className="chats-list">
          {chats.map((chat) => (
            <div key={chat.chatId} className="chat-item">
              <div className="chat-item-content" onClick={() => handleChatClick(chat.chatId)}>
                <div className="chat-item-header">
                  <span className="chat-id">{chat.chatId}</span>
                  <span className="chat-date">{formatDate(chat.createdAt)}</span>
                </div>
                <div className="chat-preview">
                  {getFirstUserMessage(chat)}
                </div>
                <div className="chat-stats">
                  <span>{chat.messages.length} messages</span>
                  <span>•</span>
                  <span>${chat.totalUsage.estimatedCost.toFixed(4)}</span>
                  <span>•</span>
                  <span>{chat.model}</span>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(chat.chatId);
                }}
                disabled={deletingChatId === chat.chatId}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdminKeyInput && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Chat</h2>
            <p>Enter admin key to confirm deletion:</p>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin key"
              className="admin-key-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmDelete();
                } else if (e.key === 'Escape') {
                  handleCancelDelete();
                }
              }}
            />
            <div className="modal-buttons">
              <button onClick={handleCancelDelete} className="cancel-button">
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="confirm-delete-button"
                disabled={!adminKey.trim()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatsListPage;
