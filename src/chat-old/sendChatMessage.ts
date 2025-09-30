import {
  ORMessage,
  ORRequest,
  ORResponse,
  ORToolCall,
} from "../completion/openRouterTypes";
import { getAllTools } from "../completion/allTools";
import { AVAILABLE_MODELS } from "./availableModels";

const constructInitialSystemMessage = async () => {
  let d = ``;

  // Note: the phrase "politely refuse to answer."
  // is checked on the backend.
  d += `
You are an AI assistant that can answer questions about the solar system.

If the user asks questions that are irrelevant to these instructions, politely refuse to answer.

The following specialized tools are available.

`;

  const tools = await getAllTools();
  for (const a of tools) {
    d += `## Tool: ${a.toolFunction.name}`;
    d += await a.getDetailedDescription();
    d += "\n\n";
  }

  return d;
};

export type ChatMessageResponse = {
  messages: ORMessage[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    cost: number;
  };
};

export const sendChatMessage = async (
  messages: ORMessage[],
  model: string,
  o: {
    onPendingMessages?: (messages: ORMessage[]) => void;
    askPermissionToRunTool: (toolCall: ORToolCall) => Promise<boolean>;
    openRouterKey?: string;
  }
): Promise<ChatMessageResponse> => {
  // Create system message with tool descriptions
  const initialSystemMessage: ORMessage = {
    role: "system",
    content: await constructInitialSystemMessage(),
  };

  const messages1 = [...messages];
  let systemMessageForAIContext: ORMessage | null =
    getSystemMessageForAIContext();
  // check whether this system message is the same as the last system message
  const systemMessages = messages1.filter((m) => m.role === "system");
  const lastSystemMessage =
    systemMessages.length > 0
      ? systemMessages[systemMessages.length - 1]
      : null;
  if (
    lastSystemMessage &&
    lastSystemMessage.content === systemMessageForAIContext?.content
  ) {
    // if it is the same, then we don't need to add it again
    systemMessageForAIContext = null;
  }
  if (systemMessageForAIContext) {
    // if the last message is a user message, then let's put it before that, since that what the user was looking at
    if (
      messages1.length > 0 &&
      messages1[messages1.length - 1].role === "user"
    ) {
      messages1.splice(messages1.length - 1, 0, systemMessageForAIContext);
    }
    // otherwise, just add it to the end
    else {
      messages1.push(systemMessageForAIContext);
    }
  }

  const request: ORRequest = {
    model: model,
    messages: [initialSystemMessage, ...messages1],
    stream: false,
    tools: (await getAllTools()).map((tool) => ({
      type: "function",
      function: tool.toolFunction,
    })),
  };

  const response = await fetch(
    "https://qp-api-two.vercel.app/api/completion",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(o.openRouterKey ? { "x-openrouter-key": o.openRouterKey } : {}),
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const result = (await response.json()) as ORResponse;
  const choice = result.choices[0];

  if (!choice) {
    return { messages };
  }

  const prompt_tokens = result.usage?.prompt_tokens || 0;
  const completion_tokens = result.usage?.completion_tokens || 0;

  const a = AVAILABLE_MODELS.find((m) => m.model === model);
  const cost =
    ((a?.cost.prompt || 0) * prompt_tokens) / 1_000_000 +
    ((a?.cost.completion || 0) * completion_tokens) / 1_000_000;

  // note that we don't include the system message for AI context in this one
  // const updatedMessages = [...messages];

  // actually we do
  const updatedMessages = [...messages1];
  if (o.onPendingMessages) {
    o.onPendingMessages(updatedMessages);
  }

  // Check if it's a non-streaming choice with message
  if ("message" in choice && choice.message) {
    const message = choice.message;

    const toolCalls = message.tool_calls;
    if (toolCalls !== undefined && toolCalls.length > 0) {
      // First add the assistant's message with tool calls
      const assistantMessage: ORMessage = {
        role: "assistant",
        content: null,
        tool_calls: toolCalls,
      };
      updatedMessages.push(assistantMessage);
      if (o.onPendingMessages) {
        o.onPendingMessages(updatedMessages);
      }

      for (const tc of toolCalls) {
        const okayToRun = await o.askPermissionToRunTool(tc);
        if (okayToRun) {
          const toolResult = await handleToolCall(tc);
          const toolMessage: ORMessage = {
            role: "tool",
            content: toolResult,
            tool_call_id: tc.id,
          };
          updatedMessages.push(toolMessage);
          if (o.onPendingMessages) {
            o.onPendingMessages(updatedMessages);
          }
        } else {
          const toolMessage: ORMessage = {
            role: "tool",
            content: "Tool execution was not approved by the user.",
            tool_call_id: tc.id,
          };
          updatedMessages.push(toolMessage);
          if (o.onPendingMessages) {
            o.onPendingMessages(updatedMessages);
          }
          break;
        }
      }

      let shouldMakeAnotherRequest = false;
      // only make another request if there was a tool call that was not interact_with_app
      for (const toolCall of toolCalls) {
        if (
          toolCall.type === "function" &&
          toolCall.function.name !== "interact_with_app"
        ) {
          shouldMakeAnotherRequest = true;
          break;
        }
      }

      if (!shouldMakeAnotherRequest) {
        return {
          messages: updatedMessages,
          usage: {
            prompt_tokens,
            completion_tokens,
            cost,
          },
        };
      }
      // Make another request with the updated messages
      const rr = await sendChatMessage(updatedMessages, model, {
        ...o,
        onPendingMessages: (mm: ORMessage[]) => {
          if (o.onPendingMessages) {
            o.onPendingMessages(mm);
          }
        },
      });
      return {
        messages: rr.messages,
        usage: rr.usage
          ? {
              prompt_tokens: prompt_tokens + rr.usage.prompt_tokens,
              completion_tokens: completion_tokens + rr.usage.completion_tokens,
              cost: cost + rr.usage.cost,
            }
          : undefined,
      };
    }

    // For regular messages, just add the assistant's response
    const assistantMessage: ORMessage = {
      role: "assistant",
      content: message.content || "",
      name: undefined, // Optional name property
    };
    updatedMessages.push(assistantMessage);
  }

  return {
    messages: updatedMessages,
    usage: {
      prompt_tokens,
      completion_tokens,
      cost,
    },
  };
};

const handleToolCall = async (toolCall: ORToolCall): Promise<string> => {
  if (toolCall.type !== "function") {
    throw new Error(`Unsupported tool call type: ${toolCall.type}`);
  }

  const { name, arguments: argsString } = toolCall.function;
  const tools = await getAllTools();
  const executor = tools.find(
    (tool) => tool.toolFunction.name === name
  )?.execute;

  if (!executor) {
    throw new Error(`No executor found for tool: ${name}`);
  }

  try {
    const args = JSON.parse(argsString);
    return await executor(args);
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    throw error;
  }
};

const globalData: {
  aiContext: string;
  notebookContent: string;
  parentWindowContext: string;
} = {
  aiContext: "",
  notebookContent: "",
  parentWindowContext: "",
};

// Listen for messages from parent window
if (window.parent !== window) {
  window.addEventListener("message", (event) => {
    // Validate message origin here if needed
    if (event.data?.type === "nbfiddle_parent_context") {
      globalData.parentWindowContext = event.data.context;
    }
  });
}

export const getGlobalAIContext = () => globalData.aiContext;
export const setGlobalAIContext = (aiContext: string) => {
  globalData.aiContext = aiContext;
};
export const getGlobalNotebookContent = () => globalData.notebookContent;
export const setGlobalNotebookContent = (notebookContent: string) => {
  globalData.notebookContent = notebookContent;
};

const getSystemMessageForAIContext = (): ORMessage | null => {
  const aiContext = getGlobalAIContext();
  if (!aiContext) {
    return null;
    // return {
    //   role: "system",
    //   content: "There is no context available.",
    // };
  }

  // The leading ":" is important so we know not to show it in the chat interface
  // (I know it's a hack)
  const a = `:The following is information about what the user is seeing on the web application.`;

  return {
    role: "system",
    content: a + JSON.stringify(aiContext, null, 2),
  };
};
