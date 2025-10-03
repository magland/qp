/* eslint-disable @typescript-eslint/no-explicit-any */
type ORFunctionCall = {
  name: string;
  arguments: string; // JSON format arguments
};

type ORToolCall = {
  id: string;
  type: "function";
  function: ORFunctionCall;
};

export type ORTextContent = {
  type: "text";
  text: string;
};

type ORImageContentPart = {
  type: "image_url";
  image_url: {
    url: string; // URL or base64 encoded image data
    detail?: string; // Optional, defaults to 'auto'
  };
};

export type ORContentPart = ORTextContent | ORImageContentPart;

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

export interface ToolExecutionContext {
  jupyterConnectivity?: any; // JupyterConnectivityState;
  imageUrlsNeedToBeUser?: boolean;
  onCancelRef?: {
    onCancel?: () => void;
  };
}

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
  createToolCallView?: (
    toolCall: ORToolCall,
    toolOutput: (ChatMessage & { role: "tool" }) | undefined,
  ) => React.JSX.Element;
}
