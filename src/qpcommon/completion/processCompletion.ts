/* eslint-disable @typescript-eslint/no-explicit-any */
import { QPTool } from "../types";
import { Chat, ChatMessage, CompletionRequest } from "../types";
import { AVAILABLE_MODELS } from "./availableModels";
import { getStoredApiKey } from "../utils/apiKeyStorage";

import { ORResponse, ORToolCall } from "./openRouterTypes";

const processCompletion = async (
  chat: Chat,
  onPartialResponse: (messages: ChatMessage[]) => void,
  tools: QPTool[],
  initialSystemMessage: string
): Promise<ChatMessage[]> => {
  const request: CompletionRequest = {
    model: chat.model,
    systemMessage: initialSystemMessage,
    messages: chat.messages,
    tools: tools.map((tool) => ({
      type: "function",
      function: tool.toolFunction,
    })),
  };

  // const request: ORRequest = {
  //     model: chat.model,
  //     messages: messages1 as ORMessage[],
  //     stream: true,
  //     tools: tools.map((tool) => ({
  //         type: "function",
  //         function: tool.toolFunction,
  //     })),
  // };

  const apiKey = getStoredApiKey();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (apiKey) {
    headers["x-openrouter-key"] = apiKey;
  }

  const response = await fetch("https://qp-api-two.vercel.app/api/completion", {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  let done = false;
  let assistantContent = "";
  let toolCalls: ORToolCall[] | undefined = undefined;

  let promptTokens = 0;
  let completionTokens = 0;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      const chunk = new TextDecoder("utf-8").decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") {
            done = true;
            break;
          }
          try {
            let parsed;
            try {
              parsed = JSON.parse(data) as ORResponse;
            } catch (e) {
              console.warn(data);
              throw e;
            }
            const choice = parsed.choices[0];
            if (choice && "delta" in choice) {
              const delta = choice.delta;
              if (delta.content) {
                assistantContent += delta.content;
                onPartialResponse([
                  {
                    role: "assistant",
                    content: assistantContent,
                    model: chat.model,
                    usage: {
                      promptTokens: 0,
                      completionTokens: 0,
                      estimatedCost: 0,
                    },
                  },
                ]);
              }
              if (delta.tool_calls) {
                toolCalls = applyDeltaToToolCalls(toolCalls, delta.tool_calls);
              }
            }
            if (parsed.usage) {
              promptTokens += parsed.usage.prompt_tokens || 0;
              completionTokens += parsed.usage.completion_tokens || 0;
            }
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }
      }
    }
  }

  const ret: ChatMessage[] = [];

  if (toolCalls) {
      ret.push({
      role: "assistant",
      content: assistantContent,
      tool_calls: toolCalls,
      model: chat.model,
      usage: {
        promptTokens,
        completionTokens: 0,
        estimatedCost: 0,
      },
    });
    onPartialResponse([...ret]);

    for (const toolCall of toolCalls) {
        if (toolCall.type !== "function") {
            throw new Error("Unexpected tool call type: " + toolCall.type);
        }
        const toolCallId = toolCall.id;
        const functionName = toolCall.function.name;
        const functionArgs = toolCall.function.arguments;
        const functionArgsParsed = JSON.parse(functionArgs || "{}");

        const tool = tools.find((t) => t.toolFunction.name === functionName);
        if (!tool) {
            throw new Error("Tool not found: " + functionName);
        }
        const output = await tool.execute(functionArgsParsed, {});
        ret.push({
            role: "tool",
            content: output,
            tool_call_id: toolCallId,
            // name: functionName, // do we include the name or not??
        });
        onPartialResponse([...ret]);
    }
    const onPartialResponse2 = (a: ChatMessage[]) => {
        onPartialResponse([...ret, ...a]);
    }
    const x = await processCompletion({
        ...chat,
        messages: [...chat.messages, ...ret],
    }, onPartialResponse2, tools, initialSystemMessage);

    return [...ret, ...x];
  }

  const estimatedCost = getEstimatedCostForModel(
    chat.model,
    promptTokens,
    completionTokens
  );

  return [{
    role: "assistant",
    content: assistantContent,
    model: chat.model,
    usage: {
      promptTokens,
      completionTokens,
      estimatedCost,
    },
  }];
};

const getEstimatedCostForModel = (
  model: string,
  promptTokens: number,
  completionTokens: number
): number => {
  for (const m of AVAILABLE_MODELS) {
    if (m.model === model) {
      return (
        (m.cost.prompt * promptTokens + m.cost.completion * completionTokens) /
        1_000_000
      );
    }
  }
  return 0;
};

const applyDeltaToToolCalls = (current: ORToolCall[] | undefined, delta: any[]): ORToolCall[] => {
  // Initialize if null
  if (!current) {
    current = [];
  }
  
  // Process each delta tool call
  for (const deltaToolCall of delta) {
    // Delta tool calls have an 'index' property to identify which tool call they belong to
    const index = deltaToolCall.index;
    
    // Find existing tool call at this index
    if (index >= current.length) {
      // First time seeing this tool call index, create new entry
      current.push({
        id: deltaToolCall.id || '',
        type: deltaToolCall.type,
        function: {
          name: deltaToolCall.function.name || '',
          arguments: deltaToolCall.function.arguments || ''
        }
      });
    } else {
      // Append to existing tool call at this index
      const existingToolCall = current[index];
      
      // Update id if present (usually only in first delta for this index)
      if (deltaToolCall.id) {
        existingToolCall.id = deltaToolCall.id;
      }
      
      // Update function name if present (usually only in first delta)
      if (deltaToolCall.function.name) {
        existingToolCall.function.name = deltaToolCall.function.name;
      }
      
      // Append arguments incrementally
      if (deltaToolCall.function.arguments) {
        existingToolCall.function.arguments += deltaToolCall.function.arguments;
      }
    }
  }
  
  return current;
};

export default processCompletion;
