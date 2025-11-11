-- D1 Database Schema for QP Chat Platform

CREATE TABLE IF NOT EXISTS chats (
  chat_id TEXT PRIMARY KEY,
  app TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  estimated_cost REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_app ON chats(app);
CREATE INDEX IF NOT EXISTS idx_created_at ON chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_updated_at ON chats(updated_at DESC);
