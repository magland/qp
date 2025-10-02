import { FunctionComponent, useState } from "react";
import MarkdownContent from "../components/MarkdownContent";
import { ChatMessage, QPTool } from "../types";

const AssistantMessageItem: FunctionComponent<{
  message: ChatMessage & { role: "assistant" };
  allToolMessages: ChatMessage[];
  tools: QPTool[];
  inProgress: boolean;
  chatId?: string;
  onFeedbackUpdate?: (feedback: { thumbs?: "up" | "down"; comment?: string }) => void;
}> = ({ message, allToolMessages, tools, inProgress, chatId, onFeedbackUpdate }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState(message.feedback?.comment || "");
  const [showPublicChatMessage, setShowPublicChatMessage] = useState(false);

  const handleThumbClick = (thumbType: "up" | "down") => {
    if (!chatId) {
      setShowPublicChatMessage(true);
      return;
    }

    const currentThumb = message.feedback?.thumbs;
    
    if (currentThumb === thumbType) {
      // Clicking same thumb - allow editing
      setShowCommentInput(true);
      setCommentText(message.feedback?.comment || "");
    } else {
      // Clicking different thumb or first time
      setShowCommentInput(true);
      setCommentText("");
      if (onFeedbackUpdate) {
        onFeedbackUpdate({ thumbs: thumbType, comment: "" });
      }
    }
  };

  const handleSubmitComment = () => {
    if (onFeedbackUpdate) {
      onFeedbackUpdate({
        thumbs: message.feedback?.thumbs,
        comment: commentText.trim() || undefined,
      });
    }
    setShowCommentInput(false);
  };

  const handleCancelComment = () => {
    setCommentText(message.feedback?.comment || "");
    setShowCommentInput(false);
  };

  return (
    <div className="message message-assistant">
      {message.content && (
        <div className="message-bubble message-bubble-assistant">
          <MarkdownContent
            content={message.content || ""}
            doRehypeRaw={!inProgress}
          />
        </div>
      )}

      {/* Feedback UI - only show when not in progress */}
      {!inProgress && !message.tool_calls && (
        <div style={{ marginTop: "8px", marginLeft: "12px", width: "100%" }}>
          {/* Thumbs buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
            <button
              onClick={() => handleThumbClick("up")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
                padding: "4px 8px",
                opacity: message.feedback?.thumbs === "up" ? 1 : 0.4,
                transition: "opacity 0.2s, filter 0.2s",
                filter: message.feedback?.thumbs === "up" 
                  ? "hue-rotate(90deg) saturate(0.5) brightness(0.9)" 
                  : "grayscale(100%)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity =
                  message.feedback?.thumbs === "up" ? "1" : "0.4")
              }
              title="Helpful"
            >
              👍
            </button>
            <button
              onClick={() => handleThumbClick("down")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
                padding: "4px 8px",
                opacity: message.feedback?.thumbs === "down" ? 1 : 0.4,
                transition: "opacity 0.2s, filter 0.2s",
                filter: message.feedback?.thumbs === "down" 
                  ? "hue-rotate(-60deg) saturate(0.5) brightness(1.1)" 
                  : "grayscale(100%)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.opacity =
                  message.feedback?.thumbs === "down" ? "1" : "0.4")
              }
              title="Not helpful"
            >
              👎
            </button>
            
            {/* Clear feedback button - only shown when feedback exists */}
            {(message.feedback?.thumbs || message.feedback?.comment) && (
              <button
                onClick={() => {
                  if (onFeedbackUpdate) {
                    onFeedbackUpdate({ thumbs: undefined, comment: undefined });
                  }
                  setShowCommentInput(false);
                  setCommentText("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  opacity: 0.3,
                  transition: "opacity 0.2s",
                  color: "#6c757d",
                  marginLeft: "4px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.3")}
                title="Clear feedback"
              >
                ✕
              </button>
            )}
          </div>

          {/* Message for non-public chats */}
          {showPublicChatMessage && (
            <div
              style={{
                marginTop: "8px",
                padding: "8px 12px",
                backgroundColor: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "4px",
                fontSize: "0.85rem",
                color: "#856404",
              }}
            >
              Please make this chat public to provide feedback. We appreciate and
              encourage your feedback!
              <button
                onClick={() => setShowPublicChatMessage(false)}
                style={{
                  marginLeft: "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  textDecoration: "underline",
                  color: "#856404",
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Comment input */}
          {showCommentInput && (
            <div style={{ width: "100%", marginTop: "8px" }}>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Optional: Add a comment about this response..."
                style={{
                  width: "100%",
                  minHeight: "60px",
                  padding: "8px",
                  fontSize: "0.9rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ marginTop: "6px", display: "flex", gap: "8px", paddingLeft: "12px" }}>
                <button
                  onClick={handleSubmitComment}
                  style={{
                    padding: "4px 12px",
                    fontSize: "0.85rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
                <button
                  onClick={handleCancelComment}
                  style={{
                    padding: "4px 12px",
                    fontSize: "0.85rem",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Display existing feedback comment */}
          {!showCommentInput && message.feedback?.comment && (
            <div
              onClick={() => {
                setShowCommentInput(true);
                setCommentText(message.feedback?.comment || "");
              }}
              style={{
                marginTop: "8px",
                padding: "8px 12px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontStyle: "italic",
                color: "#6c757d",
                cursor: "pointer",
              }}
              title="Click to edit feedback"
            >
              <strong style={{ fontStyle: "normal" }}>Feedback:</strong>{" "}
              {message.feedback.comment}
            </div>
          )}
        </div>
      )}

      {message.tool_calls && message.tool_calls.length > 0 && (
        <div className="tool-calls-container">
          {message.tool_calls.map((toolCall, index) => {
            const correspondingToolMessage = allToolMessages.find(
              (m) => m.role === "tool" && m.tool_call_id === toolCall.id
            );
            if (
              correspondingToolMessage &&
              correspondingToolMessage.role !== "tool"
            ) {
              throw new Error("Mismatched tool message role");
            }
            const correspondingTool = tools.find(
              (t) => t.toolFunction.name === toolCall.function.name
            );
            if (correspondingTool && correspondingTool.createToolCallView) {
              return (
                <span key={index}>
                  {correspondingTool.createToolCallView(
                    toolCall,
                    correspondingToolMessage
                  )}
                </span>
              );
            }
            // other wise we just show "Calling [tool name]..." or "Called [tool name]"
            if (correspondingToolMessage) {
              return (
                <div key={index} className="tool-call-message">
                  <strong>Called {toolCall.function.name}</strong>
                </div>
              );
            } else {
              return (
                <div key={index} className="tool-call-message">
                  <strong>Calling {toolCall.function.name}...</strong>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default AssistantMessageItem;
