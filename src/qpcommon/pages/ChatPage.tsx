import { FunctionComponent, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../hooks/useChat";
import ChatInput from "../components/ChatInput";
import UsageDisplay from "../components/UsageDisplay";
import MarkdownContent from "../components/MarkdownContent";
import { Chat } from "../types";
import { QPTool } from "../QPTool";

interface ChatPageProps {
  width: number;
  height: number;
  chatId: string;
  getTools: (chat: Chat) => Promise<QPTool[]>;
  assistantDescription: string;
}

const ChatPage: FunctionComponent<ChatPageProps> = ({ chatId, width, height, getTools, assistantDescription }) => {
  const navigate = useNavigate();
  const { chat, submitUserMessage, loadingChat, generateInitialResponse, responding, partialResponse, setChatModel, error } = useChat(chatId, getTools, assistantDescription);
  const [newPrompt, setNewPrompt] = useState<string>("");
  const conversationRef = useRef<HTMLDivElement>(null);

  // make sure we never generate the initial response more than once
  const generatedInitialResponse = useRef(false);

  // Check if chat should be disabled based on last message containing trigger phrases
  const chatDisabledInfo = useMemo(() => {
    if (!chat || chat.messages.length === 0) {
      return { isDisabled: false, reason: "" };
    }

    const lastMessage = chat.messages[chat.messages.length - 1];
    
    // Only check assistant messages for trigger phrases
    if (lastMessage.role !== 'assistant') {
      return { isDisabled: false, reason: "" };
    }

    const content = lastMessage.content.toLowerCase();

    if (content.includes('#irrelevant')) {
      return {
        isDisabled: true,
        reason: "This chat has been disabled because the conversation became irrelevant to the intended purpose."
      };
    }

    if (content.includes('#personal-info')) {
      return {
        isDisabled: true,
        reason: "This chat has been disabled because personal information was shared that should not be made public."
      };
    }

    if (content.includes('@manipulation')) {
      return {
        isDisabled: true,
        reason: "This chat has been disabled due to suspected attempt to manipulate the assistant or break its guidelines."
      };
    }

    return { isDisabled: false, reason: "" };
  }, [chat]);

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

  const handleNewChat = useCallback(() => {
    navigate("/qp/chat");
  }, [navigate]);

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
        <div className="error-message">{error || "Chat not found."}</div>
      </div>
    );
  }

  return (
    <div style={{position: "absolute", top: 0, left: 0, width: width, height: height}}>
      <div className="chat-container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          margin: '8px 20px'
        }}>
          <div style={{
            flex: 1,
            padding: '6px 12px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            color: '#856404',
            fontSize: '0.9em',
            textAlign: 'center'
          }}>
            ⚠️ Warning: All chats should be considered public.
          </div>
          <button 
            onClick={handleNewChat} 
            className="new-chat-button"
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.875rem',
              borderRadius: '6px',
              flexShrink: 0
            }}
          >
            + New Chat
          </button>
        </div>
        
        <div className="conversation-area" ref={conversationRef}>
          {chat.messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}>
              <div className={`message-bubble ${msg.role === 'user' ? 'message-bubble-user' : 'message-bubble-assistant'}`}>
                {msg.role === 'assistant' ? <MarkdownContent content={msg.content} /> : msg.content }
              </div>
            </div>
          ))}
          
          {responding && partialResponse && (
            chat.messages.length > 0 && chat.messages[chat.messages.length - 1].role !== 'assistant' ? (
              <div className="message message-assistant">
                <div className="message-label">Assistant</div>
                <div className="partial-response">
                  <MarkdownContent content={partialResponse} />
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
        
        {error && (
          <div style={{
            padding: '12px',
            margin: '10px 20px',
            backgroundColor: '#fee',
            border: '2px solid #c00',
            borderRadius: '4px',
            color: '#c00',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            ⚠️ Error: {error}
          </div>
        )}

        {chatDisabledInfo.isDisabled && (
          <div style={{
            padding: '12px',
            margin: '10px 20px',
            backgroundColor: '#fee',
            border: '2px solid #c00',
            borderRadius: '4px',
            color: '#c00',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            ⚠️ {chatDisabledInfo.reason}
          </div>
        )}
        
        <ChatInput
          value={newPrompt}
          onChange={setNewPrompt}
          onSubmit={handleSubmit}
          disabled={responding || chatDisabledInfo.isDisabled || !!error}
        />

        <UsageDisplay model={chat.model} setModel={setChatModel} totalUsage={chat.totalUsage} />
      </div>
    </div>
  );
};

export default ChatPage;
