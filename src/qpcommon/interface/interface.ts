import { Chat, ChatMessage } from "../types";

const API_BASE_URL = "https://qp-api-two.vercel.app/api";

export type ChatAction = {
    type: "add_message";
    message: ChatMessage;
} | {
    type: "set_model";
    model: string;
} | {
    type: "increment_usage";
    usage: {
        promptTokens: number;
        completionTokens: number;
        estimatedCost: number;
    }
} | {
    type: "set_chat";
    chat: Chat;
}

export const emptyChat = {
    chatId: "",
    messages: [],
    totalUsage: {
        promptTokens: 0,
        completionTokens: 0,
        estimatedCost: 0
    },
    model: "openai/gpt-4.1-mini"
};

export const chatReducer = (state: Chat, action: ChatAction): Chat => {
    switch (action.type) {
        case "add_message":
            return {
                ...state,
                messages: [...state.messages, action.message]
            };
        case "set_model":
            return {
                ...state,
                model: action.model
            };
        case "increment_usage":
            return {
                ...state,
                totalUsage: {
                    promptTokens: state.totalUsage.promptTokens + action.usage.promptTokens,
                    completionTokens: state.totalUsage.completionTokens + action.usage.completionTokens,
                    estimatedCost: state.totalUsage.estimatedCost + action.usage.estimatedCost
                }
            };
        case "set_chat":
            return action.chat;
        default:
            return state;
    }
};

export const createNewChat = async (initialPrompt: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/chats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initialPrompt }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create chat');
    }

    const data = await response.json();
    return data.chatId;
};

export const getChat = async (chatId: string): Promise<Chat | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}`);

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch chat');
        }

        const chat = await response.json();
        
        // Convert date strings back to Date objects if needed
        if (chat.createdAt) {
            chat.createdAt = new Date(chat.createdAt);
        }
        if (chat.updatedAt) {
            chat.updatedAt = new Date(chat.updatedAt);
        }

        return chat;
    } catch (error) {
        console.error('Error fetching chat:', error);
        throw error;
    }
};

export const saveChat = async (chat: Chat): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chats/${chat.chatId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(chat),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save chat');
    }
};

export const listChats = async (): Promise<Chat[]> => {
    const response = await fetch(`${API_BASE_URL}/chats`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to list chats');
    }

    const chats = await response.json();
    
    // Convert date strings back to Date objects if needed
    return chats.map((chat: Chat) => ({
        ...chat,
        createdAt: chat.createdAt ? new Date(chat.createdAt) : undefined,
        updatedAt: chat.updatedAt ? new Date(chat.updatedAt) : undefined,
    }));
};

export const deleteChat = async (chatId: string, adminKey: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
            'x-admin-key': adminKey,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete chat');
    }
};
