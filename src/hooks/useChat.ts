import { useCallback, useEffect, useState } from "react";
import { addChatMessage, Chat, getChat } from "../interface/interface";
import processCompletion from "../completion/processCompletion";

const useChat = (chatId: string) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loadingChat, setLoadingChat] = useState<boolean>(true);
  const [responding, setResponding] = useState<boolean>(false);
  const [partialResponse, setPartialResponse] = useState<string>("");

  const loadChat = useCallback(async () => {
    setLoadingChat(true);
    const fetchedChat = await getChat(chatId);
    setChat(fetchedChat);
    setLoadingChat(false);
    return fetchedChat;
  }, [chatId]);

  const addMessage = useCallback(async (message: { role: 'user' | 'assistant'; content: string }) => {
    await addChatMessage(chatId, message);
    const newChat = await loadChat();
    if (!newChat) throw new Error("Chat not found after adding message");
    return newChat;
  }, [chatId, loadChat]);

  const generateResponse = useCallback(async (chat: Chat) => {
    setResponding(true);
    setPartialResponse("");
    const newAssistantMessage = await processCompletion(chat, setPartialResponse);
    const newChat = await addMessage(newAssistantMessage);
    setPartialResponse("");
    setResponding(false);
    return newChat;
  }, [addMessage]);

  const submitUserMessage = useCallback(async (content: string) => {
    const userMessage = { role: 'user' as const, content };
    const newChat = await addMessage(userMessage);
    await generateResponse(newChat);
  }, [addMessage, generateResponse]);

  const generateInitialResponse = useCallback(async () => {
    if (chat?.messages.length !== 1 || chat.messages[0].role !== 'user') {
      throw new Error("Chat does not have exactly one user message");
    }
    return await generateResponse(chat);
  }, [chat, generateResponse]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  return { chat, setChat, submitUserMessage, loadingChat, generateInitialResponse, responding, partialResponse };
}

export default useChat;