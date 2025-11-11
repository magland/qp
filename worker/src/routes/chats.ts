// Chat CRUD routes

import { Env, Chat } from '../types';
import { getCorsHeaders } from '../utils/cors';
import { validateAdminKey, createUnauthorizedResponse } from '../utils/auth';
import { validateChat, generateChatId } from '../utils/validation';
import {
  createChatInDb,
  getChatFromDb,
  updateChatInDb,
  listChatsFromDb,
  deleteChatFromDb,
} from '../services/db';

// POST /api/chats - Create new chat
export async function handleCreateChat(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json();
    
    if (!body.chat || !validateChat(body.chat)) {
      return new Response(
        JSON.stringify({ error: 'Invalid chat data' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          }
        }
      );
    }
    
    const chat: Chat = body.chat;
    
    // Generate chatId if not provided
    if (!chat.chatId || chat.chatId === '') {
      chat.chatId = generateChatId();
    }
    
    const chatId = await createChatInDb(env, chat);
    
    return new Response(
      JSON.stringify({ chatId }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  } catch (error) {
    console.error('Error creating chat:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  }
}

// GET /api/chats/:chatId - Get chat by ID
export async function handleGetChat(
  request: Request,
  env: Env,
  chatId: string
): Promise<Response> {
  try {
    const chat = await getChatFromDb(env, chatId);
    
    if (!chat) {
      return new Response(
        JSON.stringify({ error: 'Chat not found' }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          }
        }
      );
    }
    
    return new Response(
      JSON.stringify(chat),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  } catch (error) {
    console.error('Error getting chat:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  }
}

// PUT /api/chats/:chatId - Update chat
export async function handleUpdateChat(
  request: Request,
  env: Env,
  chatId: string
): Promise<Response> {
  try {
    const body = await request.json();
    
    if (!body.chat || !validateChat(body.chat)) {
      return new Response(
        JSON.stringify({ error: 'Invalid chat data' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          }
        }
      );
    }
    
    const chat: Chat = body.chat;
    
    // Ensure chatId matches
    if (chat.chatId !== chatId) {
      return new Response(
        JSON.stringify({ error: 'Chat ID mismatch' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          }
        }
      );
    }
    
    await updateChatInDb(env, chat);
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  } catch (error) {
    console.error('Error updating chat:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  }
}

// GET /api/chats?app={appName} - List chats (requires admin key)
export async function handleListChats(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Validate admin key
    if (!validateAdminKey(request, env)) {
      const response = createUnauthorizedResponse();
      const headers = new Headers(response.headers);
      Object.entries(getCorsHeaders(request)).forEach(([key, value]) => {
        headers.set(key, value as string);
      });
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }
    
    const url = new URL(request.url);
    const app = url.searchParams.get('app');
    
    if (!app) {
      return new Response(
        JSON.stringify({ error: 'App parameter required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          }
        }
      );
    }
    
    const chats = await listChatsFromDb(env, app);
    
    return new Response(
      JSON.stringify(chats),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  } catch (error) {
    console.error('Error listing chats:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  }
}

// DELETE /api/chats/:chatId - Delete chat (requires admin key)
export async function handleDeleteChat(
  request: Request,
  env: Env,
  chatId: string
): Promise<Response> {
  try {
    // Validate admin key
    if (!validateAdminKey(request, env)) {
      const response = createUnauthorizedResponse();
      const headers = new Headers(response.headers);
      Object.entries(getCorsHeaders(request)).forEach(([key, value]) => {
        headers.set(key, value as string);
      });
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }
    
    await deleteChatFromDb(env, chatId);
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  } catch (error) {
    console.error('Error deleting chat:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...getCorsHeaders(request)
        }
      }
    );
  }
}
