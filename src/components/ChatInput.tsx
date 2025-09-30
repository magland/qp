import { FunctionComponent, useRef, useEffect, useCallback } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: FunctionComponent<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type your message here... (Enter to send, Shift+Enter for new line)"
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: allow default behavior (new line)
        return;
      } else {
        // Enter: submit
        e.preventDefault();
        onSubmit();
      }
    }
  }, [onSubmit]);

  const handleSubmit = useCallback(() => {
    if (value.trim() === "" || disabled) return;
    onSubmit();
  }, [value, onSubmit, disabled]);

  return (
    <div className="input-area">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="chat-input"
        disabled={disabled}
      />
      <button
        onClick={handleSubmit}
        disabled={value.trim() === "" || disabled}
        className="send-button"
        title="Send message"
      >
        ➤
      </button>
    </div>
  );
};

export default ChatInput;
