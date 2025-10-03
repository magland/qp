/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORResponse, ORToolCall } from "./openRouterTypes";

export interface StreamParseResult {
  assistantContent: string;
  toolCalls: ORToolCall[] | undefined;
  promptTokens: number;
  completionTokens: number;
}

export const parseCompletionStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunkProcessed?: (assistantContent: string) => void,
): Promise<StreamParseResult> => {
  let done = false;
  let assistantContent = "";
  let toolCalls: ORToolCall[] | undefined = undefined;

  let promptTokens = 0;
  let completionTokens = 0;
  let buffer = ""; // Buffer for incomplete lines

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      const chunk = new TextDecoder("utf-8").decode(value);
      // Prepend any buffered content from the previous chunk
      const combined = buffer + chunk;
      const lines = combined.split("\n");

      // The last element might be incomplete if chunk doesn't end with \n
      // Save it to buffer for next iteration
      buffer = lines.pop() || "";

      // Process complete lines only
      for (const line of lines) {
        if (line.trim() === "") continue;
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
                if (onChunkProcessed) {
                  onChunkProcessed(assistantContent);
                }
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

  // Process any remaining buffered content when stream is done
  if (buffer.trim() !== "") {
    const line = buffer.trim();
    if (line.startsWith("data: ")) {
      const data = line.replace("data: ", "").trim();
      if (data !== "[DONE]") {
        try {
          const parsed = JSON.parse(data) as ORResponse;
          const choice = parsed.choices[0];
          if (choice && "delta" in choice) {
            const delta = choice.delta;
            if (delta.content) {
              assistantContent += delta.content;
              if (onChunkProcessed) {
                onChunkProcessed(assistantContent);
              }
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
          console.error("Error parsing buffered line:", e);
        }
      }
    }
  }

  return {
    assistantContent,
    toolCalls,
    promptTokens,
    completionTokens,
  };
};

export const applyDeltaToToolCalls = (
  current: ORToolCall[] | undefined,
  delta: any[],
): ORToolCall[] => {
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
        id: deltaToolCall.id || "",
        type: deltaToolCall.type,
        function: {
          name: deltaToolCall.function.name || "",
          arguments: deltaToolCall.function.arguments || "",
        },
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
