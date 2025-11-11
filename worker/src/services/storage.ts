// R2 Storage service for chat content

import { Env, ChatMessage } from '../types';

const CHAT_PREFIX = 'chats/';

export async function saveChatContent(
  env: Env,
  chatId: string,
  messages: ChatMessage[]
): Promise<void> {
  const key = `${CHAT_PREFIX}${chatId}.json`;
  const content = JSON.stringify(messages);
  
  await env.CHAT_STORAGE.put(key, content, {
    httpMetadata: {
      contentType: 'application/json',
    },
  });
}

export async function getChatContent(
  env: Env,
  chatId: string
): Promise<ChatMessage[] | null> {
  const key = `${CHAT_PREFIX}${chatId}.json`;
  const object = await env.CHAT_STORAGE.get(key);
  
  if (!object) {
    return null;
  }
  
  const content = await object.text();
  return JSON.parse(content) as ChatMessage[];
}

export async function deleteChatContent(
  env: Env,
  chatId: string
): Promise<void> {
  const key = `${CHAT_PREFIX}${chatId}.json`;
  await env.CHAT_STORAGE.delete(key);
}
