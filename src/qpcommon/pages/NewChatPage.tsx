import { FunctionComponent, useCallback, useState, useEffect, useRef } from "react";
import { Preferences } from "../MainWindow";

interface NewChatPageProps {
  width: number;
  height: number;
  onSubmitInitialPrompt: (prompt: string) => void;
  preferences: Preferences
}

const NewChatPage: FunctionComponent<NewChatPageProps> = ({ onSubmitInitialPrompt, preferences }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = useCallback(async () => {
    if (prompt.trim() !== "" && !isSubmitting) {
      setIsSubmitting(true);
      onSubmitInitialPrompt(prompt.trim());
    }
  }, [prompt, onSubmitInitialPrompt, isSubmitting]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (!e.ctrlKey && !e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
  }, [onSubmit]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [prompt]);

  const canSubmit = prompt.trim() !== "" && !isSubmitting;

  return (
    <div className="new-chat-container">
      <div className="new-chat-card">
        <h1 className="new-chat-title">{preferences.newChatTitle || "New Chat"}</h1>
        
        <div style={{
          padding: '6px 12px',
          margin: '10px 0',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          color: '#856404',
          fontSize: '0.9em',
          textAlign: 'center'
        }}>
          ⚠️ Warning: All chats are public.
        </div>
        
        <div className="prompt-input-container">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={preferences.newChatPromptPlaceholderText || "Enter your prompt here..."}
            className="prompt-textarea"
            disabled={isSubmitting}
            autoFocus
          />
        </div>
        
        <button 
          onClick={onSubmit}
          disabled={!canSubmit}
          className="start-chat-button"
        >
          {isSubmitting ? "Starting..." : "Start Chat"}
        </button>
      </div>
    </div>
  );
}

export default NewChatPage;
