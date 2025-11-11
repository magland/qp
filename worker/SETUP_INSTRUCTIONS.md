# Quick Setup Instructions

If you're getting the error `no such table: chats`, you need to initialize the database.

## Steps to Fix:

### 1. Navigate to worker directory
```bash
cd worker
```

### 2. Install dependencies (if not done yet)
```bash
npm install
```

### 3. Create D1 database (if not created yet)
```bash
wrangler d1 create qp-production-db
```

This will output something like:
```
✅ Successfully created DB 'qp-production-db'

[[d1_databases]]
binding = "DB"
database_name = "qp-production-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id` and update it in `wrangler.toml`**

### 4. Run the schema migration
```bash
wrangler d1 execute qp-production-db --file=./src/schema.sql --remote
```

This creates the `chats` table in your D1 database.

### 5. Verify the table was created
```bash
wrangler d1 execute qp-production-db --command="SELECT name FROM sqlite_master WHERE type='table';" --remote
```

You should see `chats` in the output.

### 6. Create R2 bucket
```bash
wrangler r2 bucket create qp-chat-storage
```

### 7. Set secrets
```bash
wrangler secret put OPENROUTER_API_KEY
# Enter your OpenRouter API key

wrangler secret put ADMIN_KEY
# Enter a secure admin key for managing chats
```

### 8. Deploy
```bash
npm run deploy
```

## For Local Development

If testing locally with `wrangler dev`, you need to create a local database:

```bash
# Create local D1 database
wrangler d1 execute qp-production-db --local --file=./src/schema.sql
```

Then run:
```bash
npm run dev
```

## Troubleshooting

### "database_id" not found
- Make sure you've copied the database_id from step 3 into `wrangler.toml`

### "Unauthorized" errors
- Make sure you've set the ADMIN_KEY secret in step 7
- On the frontend, click the 🔑 button and enter your admin key

### R2 errors
- Make sure you've created the R2 bucket in step 6
