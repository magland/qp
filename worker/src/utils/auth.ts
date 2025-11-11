// Authentication utilities

import { Env } from '../types';

export function validateAdminKey(request: Request, env: Env): boolean {
  const providedKey = request.headers.get('x-admin-key');
  if (!providedKey) return false;
  return providedKey === env.ADMIN_KEY;
}

export function createUnauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
