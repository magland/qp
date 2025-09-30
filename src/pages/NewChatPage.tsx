import { FunctionComponent, useCallback, useState, useEffect, useRef } from "react";

interface NewChatPageProps {
  width: number;
  height: number;
  onSubmitInitialPrompt: (prompt: string) => void;
}

const NewChatPage: FunctionComponent<NewChatPageProps> = ({ onSubmitInitialPrompt }) => {
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
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
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
        <h1 className="new-chat-title">Start a New Conversation</h1>
        
        <div className="prompt-input-container">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to talk about? (Ctrl+Enter to submit)"
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
