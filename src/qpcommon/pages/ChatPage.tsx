import { FunctionComponent, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../hooks/useChat";
import ChatInput from "../components/ChatInput";
import UsageDisplay from "../components/UsageDisplay";
import MarkdownContent from "../components/MarkdownContent";
import SettingsDialog from "../components/SettingsDialog";
import { Chat, ChatMessage } from "../types";
import { QPTool } from "../types";
import { Preferences } from "../MainWindow";
import { CHEAP_MODELS } from "../completion/cheapModels";
import { getStoredApiKey } from "../utils/apiKeyStorage";

interface ChatPageProps {
  width: number;
  height: number;
  chatId: string;
  getTools: (chat: Chat) => Promise<QPTool[]>;
  preferences: Preferences
}

const ChatPage: FunctionComponent<ChatPageProps> = ({ chatId, width, height, getTools, preferences }) => {
  const navigate = useNavigate();
  const { chat, submitUserMessage, loadingChat, generateInitialResponse, responding, partialResponse, setChatModel, error, toolsForChat } = useChat(chatId, getTools, preferences);
  const [newPrompt, setNewPrompt] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const conversationRef = useRef<HTMLDivElement>(null);

  // make sure we never generate the initial response more than once
  const generatedInitialResponse = useRef(false);

  // Check if the current model requires an API key
  const requiresApiKey = useMemo(() => {
    if (!chat) return false;
    return !CHEAP_MODELS.includes(chat.model);
  }, [chat]);

  // Check if user has provided an API key
  const hasApiKey = useMemo(() => {
    return !!getStoredApiKey();
  }, [isSettingsOpen]); // Re-check when settings dialog closes

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

    const content = (lastMessage.content || "").toLowerCase();

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
    navigate("/chat");
  }, [navigate]);

  const allMessagesIncludingPartialResponse = useMemo(() => {
    if (!chat) return [];
    if (responding && partialResponse) {
      return [...chat.messages.map(m => ({ message: m, inProgress: false })), ...partialResponse.map(m => ({ message: m, inProgress: true }))];
    }
    return chat.messages.map(m => ({ message: m, inProgress: false }));
  }, [chat, responding, partialResponse]);

  const allToolMessages = useMemo(() => {
    return allMessagesIncludingPartialResponse.filter(m => m.message.role === 'tool').map(m => m.message);
  }, [allMessagesIncludingPartialResponse]);

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
            ⚠️ Warning: All chats are public.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="new-chat-button"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.875rem',
                borderRadius: '6px',
                flexShrink: 0
              }}
              title="Settings"
            >
              ⚙️
            </button>
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
        </div>
        
        <div className="conversation-area" ref={conversationRef}>
          {allMessagesIncludingPartialResponse.map((xx, index) => (
            <MessageItem key={index} message={xx.message} allToolMessages={allToolMessages} tools={toolsForChat} inProgress={xx.inProgress} />
          ))}
          
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

        {requiresApiKey && !hasApiKey && !chatDisabledInfo.isDisabled && !error && (
          <div style={{
            padding: '12px',
            margin: '10px 20px',
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '4px',
            color: '#856404',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            ⚠️ This model requires an OpenRouter API key. Click the ⚙️ settings button to add your key or select a free model.
          </div>
        )}
        
        <ChatInput
          value={newPrompt}
          onChange={setNewPrompt}
          onSubmit={handleSubmit}
          disabled={responding || chatDisabledInfo.isDisabled || !!error || (requiresApiKey && !hasApiKey)}
        />

        <UsageDisplay model={chat.model} setModel={setChatModel} totalUsage={chat.totalUsage} />
      </div>
      
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

const MessageItem: FunctionComponent<{ message: ChatMessage, allToolMessages: ChatMessage[], tools: QPTool[], inProgress: boolean }> = ({ message, allToolMessages, tools, inProgress }) => {
  if (message.role === 'user') {
    return <div className="message message-user">
      <div className="message-bubble message-bubble-user">
        {message.content}
      </div>
    </div>;
  } else if (message.role === 'assistant') {
    return <div className="message message-assistant">
      {message.content && <div className="message-bubble message-bubble-assistant">
        <MarkdownContent content={message.content || ""} doRehypeRaw={!inProgress} />
      </div>}
      {
        message.tool_calls && message.tool_calls.length > 0 && (
          <div className="tool-calls-container">
            {message.tool_calls.map((toolCall, index) => {
              const correspondingToolMessage = allToolMessages.find(m => m.role === "tool" && m.tool_call_id === toolCall.id);
              if (correspondingToolMessage && correspondingToolMessage.role !== "tool") {
                throw new Error("Mismatched tool message role");
              }
              const correspondingTool = tools.find(t => t.toolFunction.name === toolCall.function.name);
              if (correspondingTool && correspondingTool.createToolCallView) {
                return <span key={index}>
                {correspondingTool.createToolCallView(toolCall, correspondingToolMessage)}
                </span>;
              }
              // other wise we just show "Calling [tool name]..." or "Called [tool name]"
              if (correspondingToolMessage) {
                return (<div key={index} className="tool-call-message">
                  <strong>Called {toolCall.function.name}</strong>                  
                </div>
                );
              } else {
                return (<div key={index} className="tool-call-message">
                  <strong>Calling {toolCall.function.name}...</strong>                  
                </div>
                );
              }
            })}
          </div>
        )
      }
    </div>;
  } else {
    return null;
  }
}

export default ChatPage;
