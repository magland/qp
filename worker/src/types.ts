// Shared types for the worker

export interface Env {
  DB: D1Database;
  CHAT_STORAGE: R2Bucket;
  RATE_LIMIT_KV: KVNamespace;
  OPENROUTER_API_KEY: string;
  ADMIN_KEY: string;
}

export type ORContentPart =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      image_url: {
        url: string;
        detail?: string;
      };
    };

export type ORToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type ChatMessage =
  | {
      role: "user";
      content: string | ORContentPart[];
    }
  | {
      role: "assistant";
      content: string | ORContentPart[] | null;
      tool_calls?: ORToolCall[];
      model?: string;
      usage?: {
        promptTokens: number;
        completionTokens: number;
        estimatedCost: number;
      };
      feedback?: {
        thumbs?: "up" | "down";
        comment?: string;
      };
    }
  | {
      role: "tool";
      content: string;
      tool_call_id: string;
      name?: string;
    };

export type Chat = {
  app: string;
  chatId: string;
  messages: ChatMessage[];
  totalUsage: {
    promptTokens: number;
    completionTokens: number;
    estimatedCost: number;
  };
  model: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ORFunctionDescription = {
  description?: string;
  name: string;
  parameters: object;
};

export type ORTool = {
  type: "function";
  function: ORFunctionDescription;
};

export type CompletionRequest = {
  model: string;
  systemMessage: string;
  messages: ChatMessage[];
  tools?: ORTool[];
  app?: string;       // Assistant name for per-assistant API key routing
  provider?: string;  // Optional provider preference (e.g., "Cerebras", "SambaNova")
};

export interface ChatRow {
  chat_id: string;
  app: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  estimated_cost: number;
  created_at: string;
  updated_at: string;
}
