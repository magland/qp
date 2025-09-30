import { Chat } from "../interface/interface";

import { getAllTools } from "./allTools";
import {
    ORMessage,
    ORRequest,
    ORResponse
} from "../completion/openRouterTypes";

const processCompletion = async (chat: Chat, onPartialResponse: (text: string) => void): Promise<{ role: 'assistant'; content: string }> => {
    console.log("processCompletion: chat=", chat);
    const model = "openai/gpt-4.1-mini";
    
    const initialSystemMessage = "You are an AI assistant that can answer questions about the solar system. If the user asks questions that are irrelevant to these instructions, politely refuse to answer. The following specialized tools are available.";

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
        model: model,
        messages: messages1 as ORMessage[],
        stream: true,
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
                    } catch (e) {
                        console.error("Error parsing chunk:", e);
                    }
                }
            }
        }
    }

    return { role: 'assistant', content: assistantContent };
};

export default processCompletion;