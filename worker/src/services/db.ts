// D1 Database service

import { Env, Chat, ChatRow } from '../types';
import { getChatContent, saveChatContent, deleteChatContent } from './storage';
import { MAX_CHATS_PER_APP } from '../utils/sizeValidation';

export async function createChatInDb(
  env: Env,
  chat: Chat
): Promise<string> {
  // Check chat count limit for this app
  const countResult = await env.DB.prepare(`
    SELECT COUNT(*) as count FROM chats WHERE app = ?
  `).bind(chat.app).first<{ count: number }>();
  
  const currentCount = countResult?.count || 0;
  if (currentCount >= MAX_CHATS_PER_APP) {
    throw new Error(`Chat limit exceeded for app ${chat.app}. Maximum ${MAX_CHATS_PER_APP} chats allowed.`);
  }
  
  const now = new Date().toISOString();
  
  // Save messages to R2
  await saveChatContent(env, chat.chatId, chat.messages);
  
  // Save metadata to D1
  await env.DB.prepare(`
    INSERT INTO chats (
      chat_id, app, model, prompt_tokens, completion_tokens, 
      estimated_cost, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    chat.chatId,
    chat.app,
    chat.model,
    chat.totalUsage.promptTokens,
    chat.totalUsage.completionTokens,
    chat.totalUsage.estimatedCost,
    now,
    now
  ).run();
  
  return chat.chatId;
}

export async function getChatFromDb(
  env: Env,
  chatId: string
): Promise<Chat | null> {
  const result = await env.DB.prepare(`
    SELECT * FROM chats WHERE chat_id = ?
  `).bind(chatId).first<ChatRow>();
  
  if (!result) {
    return null;
  }
  
  // Get messages from R2
  const messages = await getChatContent(env, chatId);
  if (!messages) {
    return null;
  }
  
  return {
    chatId: result.chat_id,
    app: result.app,
    model: result.model,
    messages,
    totalUsage: {
      promptTokens: result.prompt_tokens,
      completionTokens: result.completion_tokens,
      estimatedCost: result.estimated_cost,
    },
    createdAt: new Date(result.created_at),
    updatedAt: new Date(result.updated_at),
  };
}

export async function updateChatInDb(
  env: Env,
  chat: Chat
): Promise<void> {
  const now = new Date().toISOString();
  
  // Update messages in R2
  await saveChatContent(env, chat.chatId, chat.messages);
  
  // Update metadata in D1
  await env.DB.prepare(`
    UPDATE chats 
    SET model = ?, prompt_tokens = ?, completion_tokens = ?, 
        estimated_cost = ?, updated_at = ?
    WHERE chat_id = ?
  `).bind(
    chat.model,
    chat.totalUsage.promptTokens,
    chat.totalUsage.completionTokens,
    chat.totalUsage.estimatedCost,
    now,
    chat.chatId
  ).run();
}

export async function listChatsFromDb(
  env: Env,
  app: string
): Promise<Chat[]> {
  const results = await env.DB.prepare(`
    SELECT * FROM chats 
    WHERE app = ? 
    ORDER BY updated_at DESC 
    LIMIT 100
  `).bind(app).all<ChatRow>();
  
  if (!results.results) {
    return [];
  }
  
  // Fetch messages for each chat from R2
  const chats: Chat[] = [];
  for (const row of results.results) {
    const messages = await getChatContent(env, row.chat_id);
    if (messages) {
      chats.push({
        chatId: row.chat_id,
        app: row.app,
        model: row.model,
        messages,
        totalUsage: {
          promptTokens: row.prompt_tokens,
          completionTokens: row.completion_tokens,
          estimatedCost: row.estimated_cost,
        },
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      });
    }
  }
  
  return chats;
}

export async function deleteChatFromDb(
  env: Env,
  chatId: string
): Promise<void> {
  // Delete from D1
  await env.DB.prepare(`
    DELETE FROM chats WHERE chat_id = ?
  `).bind(chatId).run();
  
  // Delete from R2
  await deleteChatContent(env, chatId);
}
