/* eslint-disable @typescript-eslint/no-explicit-any */
import { QPTool, ToolExecutionContext } from "../types";
import { Chat, ChatMessage, CompletionRequest } from "../types";
import { AVAILABLE_MODELS } from "./availableModels";
import { getStoredApiKey } from "../utils/apiKeyStorage";
import { parseCompletionStream } from "./parseCompletionStream";

const processCompletion = async (
  chat: Chat,
  onPartialResponse: (messages: ChatMessage[]) => void,
  tools: QPTool[],
  initialSystemMessage: string,
  toolExecutionContext: ToolExecutionContext,
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

  const { assistantContent, toolCalls, promptTokens, completionTokens } =
    await parseCompletionStream(reader, (content) => {
      onPartialResponse([
        {
          role: "assistant",
          content,
          model: chat.model,
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            estimatedCost: 0,
          },
        },
      ]);
    });

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

      // Check if permission is required
      if (tool.requiresPermission && toolExecutionContext.requestPermission) {
        const toolDescription = tool.toolFunction.description || "";
        const granted = await toolExecutionContext.requestPermission(
          functionName,
          toolDescription,
        );
        if (!granted) {
          ret.push({
            role: "tool",
            content: "User canceled execution.",
            tool_call_id: toolCallId,
          });
          onPartialResponse([...ret]);
          continue;
        }
      }

      const { result, newMessages } = await tool.execute(
        functionArgsParsed,
        toolExecutionContext,
      );
      for (const m of newMessages || []) {
        ret.push(m);
      }
      ret.push({
        role: "tool",
        content: result,
        tool_call_id: toolCallId,
        // name: functionName, // do we include the name or not??
      });
      onPartialResponse([...ret]);
    }
    const onPartialResponse2 = (a: ChatMessage[]) => {
      onPartialResponse([...ret, ...a]);
    };
    const x = await processCompletion(
      {
        ...chat,
        messages: [...chat.messages, ...ret],
      },
      onPartialResponse2,
      tools,
      initialSystemMessage,
      toolExecutionContext,
    );

    return [...ret, ...x];
  }

  const estimatedCost = getEstimatedCostForModel(
    chat.model,
    promptTokens,
    completionTokens,
  );

  return [
    {
      role: "assistant",
      content: assistantContent,
      model: chat.model,
      usage: {
        promptTokens,
        completionTokens,
        estimatedCost,
      },
    },
  ];
};

const getEstimatedCostForModel = (
  model: string,
  promptTokens: number,
  completionTokens: number,
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

export default processCompletion;
