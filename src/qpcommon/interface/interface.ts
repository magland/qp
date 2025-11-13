import getAppName from "../getAppName";
import { Chat, ChatMessage } from "../types";

export type ChatAction =
  | {
      type: "add_message";
      message: ChatMessage;
    }
  | {
      type: "set_model";
      model: string;
    }
  | {
      type: "increment_usage";
      usage: {
        promptTokens: number;
        completionTokens: number;
        estimatedCost: number;
      };
    }
  | {
      type: "set_chat";
      chat: Chat;
    }
  | {
      type: "update_message_feedback";
      messageIndex: number;
      feedback: {
        thumbs?: "up" | "down";
        comment?: string;
      };
    }
  | {
      type: "delete_message_from_index";
      messageIndex: number;
    };

const defaultModel = "openai/gpt-4.1-mini";

export const emptyChat: Chat = {
  app: getAppName(),
  chatId: "",
  messages: [],
  totalUsage: {
    promptTokens: 0,
    completionTokens: 0,
    estimatedCost: 0,
  },
  model: defaultModel,
};

export const chatReducer = (state: Chat, action: ChatAction): Chat => {
  switch (action.type) {
    case "add_message":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case "set_model":
      return {
        ...state,
        model: action.model,
      };
    case "increment_usage":
      return {
        ...state,
        totalUsage: {
          promptTokens:
            state.totalUsage.promptTokens + action.usage.promptTokens,
          completionTokens:
            state.totalUsage.completionTokens + action.usage.completionTokens,
          estimatedCost:
            state.totalUsage.estimatedCost + action.usage.estimatedCost,
        },
      };
    case "set_chat":
      return action.chat;
    case "update_message_feedback":
      return {
        ...state,
        messages: state.messages.map((msg, index) => {
          if (index === action.messageIndex && msg.role === "assistant") {
            return {
              ...msg,
              feedback: action.feedback,
            };
          }
          return msg;
        }),
      };
    case "delete_message_from_index":
      return {
        ...state,
        messages: state.messages.slice(0, action.messageIndex),
      };
    default:
      return state;
  }
};

const API_BASE_URL = "https://qp-worker.neurosift.app";

export const createChatWithContent = async (chat: Chat): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create chat: ${response.statusText}`);
  }

  const data = await response.json();
  return data.chatId;
};

export const getChat = async (chatId: string): Promise<Chat | null> => {
  const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to get chat: ${response.statusText}`);
  }

  const chat = await response.json();
  return chat;
};

export const saveChat = async (chat: Chat): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/chats/${chat.chatId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save chat: ${response.statusText}`);
  }
};

export const listChats = async (app: string, adminKey?: string): Promise<Chat[]> => {
  // Try provided key, then localStorage, then environment variable (for dev)
  const key = adminKey || 
    (typeof localStorage !== 'undefined' ? localStorage.getItem("qp-admin-key") : null) || 
    import.meta.env.VITE_ADMIN_KEY || 
    "";
  
  const response = await fetch(`${API_BASE_URL}/api/chats?app=${encodeURIComponent(app)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": key,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized: Invalid or missing admin key");
    }
    throw new Error(`Failed to list chats: ${response.statusText}`);
  }

  const chats = await response.json();
  return chats;
};

export const deleteChat = async (
  chatId: string,
  adminKey: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete chat: ${response.statusText}`);
  }
};
