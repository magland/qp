// Request validation utilities

import { Chat, CompletionRequest } from '../types';

export function validateChat(data: any): data is Chat {
  return (
    data &&
    typeof data.app === 'string' &&
    typeof data.chatId === 'string' &&
    Array.isArray(data.messages) &&
    typeof data.model === 'string' &&
    data.totalUsage &&
    typeof data.totalUsage.promptTokens === 'number' &&
    typeof data.totalUsage.completionTokens === 'number' &&
    typeof data.totalUsage.estimatedCost === 'number'
  );
}

export function validateCompletionRequest(data: any): data is CompletionRequest {
  return (
    data &&
    typeof data.model === 'string' &&
    typeof data.systemMessage === 'string' &&
    Array.isArray(data.messages) &&
    Array.isArray(data.tools || [])
  );
}

export function generateChatId(): string {
  // Generate a random ID (similar to nanoid or uuid)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 21;
  let id = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    id += chars[randomValues[i] % chars.length];
  }
  return id;
}
