import { NextRequest, NextResponse } from 'next/server';

export const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
];

for (const appName of ['stan-assistant', 'nwb-assistant']) {
  allowedOrigins.push(`https://${appName}.vercel.app`);
  allowedOrigins.push(`http://${appName}.localhost:3000`);
  allowedOrigins.push(`http://${appName}.localhost:3001`);
  allowedOrigins.push(`http://${appName}.localhost:5173`);
  allowedOrigins.push(`http://${appName}.localhost:5174`);
}

export const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-openrouter-key, x-admin-key',
};

export function handleCorsHeaders(response: NextResponse, origin: string | null) {
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  return response;
}

export function handleOptionsRequest(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        ...corsHeaders,
        'Access-Control-Max-Age': '86400' // 24 hours cache for preflight
      }
    });
  }
  return new NextResponse(null, { status: 204 });
}

export function createCorsResponse<T>(data: T, init?: ResponseInit & { headers?: { origin?: string } }) {
  const response = NextResponse.json(data, init);
  const origin = init?.headers?.origin;

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  return response;
}
