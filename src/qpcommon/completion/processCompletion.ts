import { Chat, ChatMessage } from "../interface/interface";
import { QPTool } from "../types";
import { AVAILABLE_MODELS } from "./availableModels";

import {
    ORMessage,
    ORRequest,
    ORResponse
} from "./openRouterTypes";

const processCompletion = async (chat: Chat, onPartialResponse: (text: string) => void, tools: QPTool[], initialSystemMessage: string): Promise<ChatMessage & {role: "assistant"}> => {
    const messages1 = [{
        role: "system",
        content: initialSystemMessage
    }];
    for (const msg of chat.messages) {
        messages1.push({
            role: msg.role,
            content: msg.content
        });
    }
    
    const request: ORRequest = {
        model: chat.model,
        messages: messages1 as ORMessage[],
        stream: true,
        tools: tools.map((tool) => ({
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
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("No response body");
    }

    let done = false;
    let assistantContent = "";

    let promptTokens = 0;
    let completionTokens = 0;

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
            const chunk = new TextDecoder("utf-8").decode(value);
            const lines = chunk.split("\n").filter(line => line.trim() !== "");
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.replace("data: ", "").trim();
                    if (data === "[DONE]") {
                        done = true;
                        break;
                    }
                    try {
                        const parsed = JSON.parse(data) as ORResponse;
                        const choice = parsed.choices[0];
                        if (choice && "delta" in choice) {
                            const delta = choice.delta;
                            if (delta.content) {
                                assistantContent += delta.content;
                                onPartialResponse(assistantContent);
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

    const estimatedCost = getEstimatedCostForModel(chat.model, promptTokens, completionTokens);

    return { role: 'assistant', content: assistantContent, model: chat.model, usage: {
        promptTokens,
        completionTokens,
        estimatedCost
    } };
};

const getEstimatedCostForModel = (model: string, promptTokens: number, completionTokens: number): number => {
    for (const m of AVAILABLE_MODELS) {
        if (m.model === model) {
            return (m.cost.prompt * promptTokens + m.cost.completion * completionTokens) / 1_000_000;
        }
    }
    return 0;
};

export default processCompletion;