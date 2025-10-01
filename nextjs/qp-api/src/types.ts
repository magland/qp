type ORFunctionCall = {
  name: string;
  arguments: string; // JSON format arguments
};

type ORToolCall = {
  id: string;
  type: "function";
  function: ORFunctionCall;
};

export type ChatMessage = {
    role: 'user'
    content: string;
} | {
    role: 'assistant'
    content: string | null;
    tool_calls?: ORToolCall[];
    model: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        estimatedCost: number;
    }
} | {
  role: "tool";
  content: string;
  tool_call_id: string;
  name?: string;
}

export type Chat = {
    app: string;
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

export type ORFunctionDescription = {
  description?: string;
  name: string;
  parameters: object; // JSON Schema object
};

export type ORTool = {
  type: "function";
  function: ORFunctionDescription;
};

export type CompletionRequest = {
    model: string;
    systemMessage: string;
    messages: ChatMessage[];
    tools: ORTool[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ToolExecutionContext {}

export type QPFunctionDescription = {
  description?: string;
  name: string;
  parameters: object; // JSON Schema object
};

export interface QPTool {
  toolFunction: QPFunctionDescription;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (params: any, o?: ToolExecutionContext) => Promise<string>;
  getDetailedDescription: () => Promise<string>;
  requiresPermission: boolean;
  createToolCallView?: (toolCall: ORToolCall, toolOutput: (ChatMessage & {role: "tool"}) | undefined) => React.JSX.Element;
}
