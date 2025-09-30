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
    createdAt?: Date;
    updatedAt?: Date;
};

type ORFunctionDescription = {
  description?: string;
  name: string;
  parameters: object; // JSON Schema object
};

type ORTool = {
  type: "function";
  function: ORFunctionDescription;
};

export type CompletionRequest = {
    model: string;
    systemMessage: string;
    messages: ChatMessage[];
    tools: ORTool[];
};
