import { FunctionComponent, useEffect, useRef, useState, useCallback } from "react";
import useChat from "../hooks/useChat";
import ChatInput from "../components/ChatInput";

interface ChatPageProps {
  width: number;
  height: number;
  chatId: string;
}

const ChatPage: FunctionComponent<ChatPageProps> = ({ chatId, width, height }) => {
  const { chat, submitUserMessage, loadingChat, generateInitialResponse, responding, partialResponse } = useChat(chatId);
  const [newPrompt, setNewPrompt] = useState<string>("");
  const conversationRef = useRef<HTMLDivElement>(null);

  // make sure we never generate the initial response more than once
  const generatedInitialResponse = useRef(false);

  useEffect(() => {
    if (generatedInitialResponse.current) return;
    // if chat only has one message (the initial prompt) and it is from the user, generate a response
    if (chat && chat.messages.length === 1 && chat.messages[0].role === 'user' && !responding) {
      generatedInitialResponse.current = true;
      generateInitialResponse();
    }
  }, [chat, generateInitialResponse, responding]);

  // Auto-scroll to show new user messages at the top of visible area
  useEffect(() => {
    if (conversationRef.current && chat?.messages.length) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      if (lastMessage.role === 'user') {
        // Find the last user message element and scroll it into view
        const messageElements = conversationRef.current.querySelectorAll('.message-user');
        const lastUserMessage = messageElements[messageElements.length - 1];
        if (lastUserMessage) {
          const conversationArea = conversationRef.current;
          const availableHeight = conversationArea.clientHeight;
          
          // Calculate top offset based on available height
          let topOffset = 0;
          if (availableHeight > 800) {
            topOffset = 200;
          } else if (availableHeight > 500) {
            topOffset = 100;
          }
          
          // Get the position of the last user message relative to the conversation area
          const messageRect = lastUserMessage.getBoundingClientRect();
          const conversationRect = conversationArea.getBoundingClientRect();
          const messageTop = messageRect.top - conversationRect.top;
          
          // Calculate the scroll position to place the message at the desired offset from top
          const targetScrollTop = conversationArea.scrollTop + messageTop - topOffset;
          
          conversationArea.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [chat?.messages]);

  const handleSubmit = useCallback(() => {
    if (newPrompt.trim() === "" || responding) return;
    submitUserMessage(newPrompt.trim());
    setNewPrompt("");
  }, [newPrompt, submitUserMessage, responding]);

  if (!chat && loadingChat) {
    return (
      <div className="chat-container">
        <div className="loading-message">Loading chat...</div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="chat-container">
        <div className="error-message">Chat not found.</div>
      </div>
    );
  }

  return (
    <div style={{position: "absolute", top: 0, left: 0, width: width, height: height}}>
      <div className="chat-container">
        <div className="conversation-area" ref={conversationRef}>
          {chat.messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}>
              <div className="message-label">
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className={`message-bubble ${msg.role === 'user' ? 'message-bubble-user' : 'message-bubble-assistant'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {responding && partialResponse && (
            chat.messages.length > 0 && chat.messages[chat.messages.length - 1].role !== 'assistant' ? (
              <div className="message message-assistant">
                <div className="message-label">Assistant</div>
                <div className="partial-response">
                  {partialResponse}
                </div>
              </div>
            ) : null
          )}
          
          {responding && !partialResponse && (
            <div className="message message-assistant">
              <div className="message-label">Assistant</div>
              <div className="partial-response">
                Thinking...
              </div>
            </div>
          )}

          {/* Put empty space at the bottom so last message can scroll to top of visible area */}
          <div style={{ height: '1200px' }}></div>
        </div>
        
        <ChatInput
          value={newPrompt}
          onChange={setNewPrompt}
          onSubmit={handleSubmit}
          disabled={responding}
        />
      </div>
    </div>
  );
};

export default ChatPage;
