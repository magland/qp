# QP Cloudflare Worker Backend

This is the backend API for the QP chat platform, implemented as a Cloudflare Worker with D1 (SQL database) and R2 (object storage).

## Architecture

- **D1 Database**: Stores chat metadata (chatId, app, model, usage stats, timestamps)
- **R2 Bucket**: Stores chat content (messages array) as JSON files
- **Worker**: Serverless API handling chat CRUD operations and LLM completion streaming

## Setup

### 1. Install Dependencies

```bash
cd worker
npm install
```

### 2. Create D1 Database

```bash
# Create the database
wrangler d1 create qp-production-db

# Copy the database_id from the output and update wrangler.toml
```

Update `wrangler.toml` with your database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "qp-production-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
```

### 3. Initialize Database Schema

```bash
# Run migrations
wrangler d1 execute qp-production-db --file=./src/schema.sql
```

### 4. Create R2 Bucket

```bash
# Create the R2 bucket
wrangler r2 bucket create qp-chat-storage
```

### 5. Set Environment Variables

Set secrets for sensitive data:

```bash
# Set OpenRouter API key (for cheap models)
wrangler secret put OPENROUTER_API_KEY
# Enter your OpenRouter API key when prompted

# Set admin key (for protected operations)
wrangler secret put ADMIN_KEY
# Enter a secure admin key when prompted
```

## Development

Run the worker locally:

```bash
npm run dev
```

This will start a local development server at `http://localhost:8787`.

## Deployment

Deploy to Cloudflare:

```bash
npm run deploy
```

The worker will be deployed to your Cloudflare account and accessible at the configured route (e.g., `https://qp-worker.neurosift.app`).

## API Endpoints

### Chat Management

- **POST /api/chats** - Create new chat
  - Body: `{ chat: Chat }`
  - Returns: `{ chatId: string }`

- **GET /api/chats/:chatId** - Get chat by ID
  - Returns: `Chat` object or 404

- **PUT /api/chats/:chatId** - Update chat
  - Body: `{ chat: Chat }`
  - Returns: `{ success: boolean }`

- **GET /api/chats?app={appName}** - List chats (requires admin key)
  - Headers: `x-admin-key`
  - Returns: `Chat[]`

- **DELETE /api/chats/:chatId** - Delete chat (requires admin key)
  - Headers: `x-admin-key`
  - Returns: `{ success: boolean }`

### Completion

- **POST /api/completion** - Stream LLM completions
  - Headers: `x-openrouter-key` (optional, for non-cheap models)
  - Body: `CompletionRequest`
  - Returns: Streaming SSE response

## Environment Variables

- `OPENROUTER_API_KEY` - OpenRouter API key for cheap models
- `ADMIN_KEY` - Admin key for protected operations (list/delete chats)

## CORS Configuration

The worker allows requests from:
- `http://localhost:5173` (local development)
- `https://*.neurosift.app` (production)

## Database Schema

See `src/schema.sql` for the full schema. Key table:

```sql
CREATE TABLE chats (
  chat_id TEXT PRIMARY KEY,
  app TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  estimated_cost REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## R2 Storage Structure

Chat messages are stored in R2 at:
```
chats/{chatId}.json
```

Each file contains the full messages array for that chat.

## Monitoring

View logs:
```bash
npm run tail
```

## Troubleshooting

### TypeScript Errors

The TypeScript errors shown in the editor are expected until you run `npm install` in the worker directory. The `@cloudflare/workers-types` package provides the type definitions for Cloudflare Workers APIs (Request, Response, D1Database, R2Bucket, etc.).

### Database Not Found

Make sure you've created the D1 database and updated the `database_id` in `wrangler.toml`.

### CORS Issues

Ensure your frontend domain is included in the `ALLOWED_ORIGINS` array in `src/utils/cors.ts`.
