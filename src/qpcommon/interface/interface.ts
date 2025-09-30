const STORAGE_KEY = 'qp_chat_database';

// Load from localStorage on initialization
const loadFromStorage = (): { [key: string]: Chat } => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Failed to load chat database from localStorage:', error);
        return {};
    }
};

// Save to localStorage
const saveToStorage = (database: { [key: string]: Chat }): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    } catch (error) {
        console.error('Failed to save chat database to localStorage:', error);
    }
};

const simulatedChatDatabase: { [key: string]: Chat } = loadFromStorage();

export type ChatMessage = {
    role: 'user'
    content: string;
} | {
    role: 'assistant'
    content: string;
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        estimatedCost: number;
    }
}

export type Chat = {
    chatId: string;
    messages: ChatMessage[];
    totalUsage: {
        promptTokens: number;
        completionTokens: number;
        estimatedCost: number;
    }
    model: string;
};

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
    const chatId = `chat_${Date.now()}`;
    simulatedChatDatabase[chatId] = {
        chatId,
        messages: [{ role: 'user', content: initialPrompt }],
        totalUsage: { promptTokens: 0, completionTokens: 0, estimatedCost: 0 },
        model: "openai/gpt-4.1-mini"
    };
    saveToStorage(simulatedChatDatabase);
    return chatId;
};

export const getChat = async (chatId: string): Promise<Chat | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const chat = simulatedChatDatabase[chatId];
            resolve(chat ? { ...chat } : null);
        }, 500);
    });
};

export const saveChat = async (chat: Chat): Promise<void> => {
    simulatedChatDatabase[chat.chatId] = chat;
    saveToStorage(simulatedChatDatabase);
};
