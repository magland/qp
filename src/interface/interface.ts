const simulatedChatDatabase: { [key: string]: { messages: ChatMessage[] } } = {};

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
}

export type Chat = {
    chatId: string;
    messages: ChatMessage[];
};

export const createNewChat = async (initialPrompt: string): Promise<string> => {
    const chatId = `chat_${Date.now()}`;
    simulatedChatDatabase[chatId] = {
        messages: [{ role: 'user', content: initialPrompt }]
    };
    return chatId;
};

export const getChat = async (chatId: string): Promise<Chat | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const chat = simulatedChatDatabase[chatId];
            resolve(chat ? { chatId, messages: chat.messages } : null);
        }, 500);
    });
};

export const addChatMessage = async (chatId: string, message: ChatMessage): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (simulatedChatDatabase[chatId]) {
                simulatedChatDatabase[chatId] = {
                    messages: [...simulatedChatDatabase[chatId].messages, message]
                };
            }
            resolve();
        }, 300);
    });
};