// Main worker entry point

import { Env } from './types';
import { handleOptions, getCorsHeaders } from './utils/cors';
import { handleCompletion } from './routes/completion';
import {
  handleCreateChat,
  handleGetChat,
  handleUpdateChat,
  handleListChats,
  handleDeleteChat,
} from './routes/chats';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }
    
    const url = new URL(request.url);
    const path = url.pathname;
    
    try {
      // Route: POST /api/completion
      if (path === '/api/completion' && request.method === 'POST') {
        return await handleCompletion(request, env);
      }
      
      // Route: POST /api/chats
      if (path === '/api/chats' && request.method === 'POST') {
        return await handleCreateChat(request, env);
      }
      
      // Route: GET /api/chats?app={appName}
      if (path === '/api/chats' && request.method === 'GET') {
        return await handleListChats(request, env);
      }
      
      // Route: GET /api/chats/:chatId
      const getChatMatch = path.match(/^\/api\/chats\/([^\/]+)$/);
      if (getChatMatch && request.method === 'GET') {
        const chatId = getChatMatch[1];
        return await handleGetChat(request, env, chatId);
      }
      
      // Route: PUT /api/chats/:chatId
      const updateChatMatch = path.match(/^\/api\/chats\/([^\/]+)$/);
      if (updateChatMatch && request.method === 'PUT') {
        const chatId = updateChatMatch[1];
        return await handleUpdateChat(request, env, chatId);
      }
      
      // Route: DELETE /api/chats/:chatId
      const deleteChatMatch = path.match(/^\/api\/chats\/([^\/]+)$/);
      if (deleteChatMatch && request.method === 'DELETE') {
        const chatId = deleteChatMatch[1];
        return await handleDeleteChat(request, env, chatId);
      }
      
      // 404 for unknown routes
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request),
          },
        }
      );
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request),
          },
        }
      );
    }
  },
};
