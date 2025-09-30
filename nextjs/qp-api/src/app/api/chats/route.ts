import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";
import { Chat } from "../../../types";

// POST /api/chats - Create a new chat
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { initialPrompt } = body;

    if (!initialPrompt || typeof initialPrompt !== 'string') {
      return NextResponse.json(
        { error: "initialPrompt is required and must be a string" },
        { status: 400 }
      );
    }

    const chatId = `chat_${Date.now()}`;
    const now = new Date();

    const newChat: Chat = {
      chatId,
      messages: [{ role: 'user', content: initialPrompt }],
      totalUsage: { promptTokens: 0, completionTokens: 0, estimatedCost: 0 },
      model: "openai/gpt-4.1-mini",
      createdAt: now,
      updatedAt: now
    };

    const db = await getDatabase();
    const chatsCollection = db.collection<Chat>('chats');
    
    await chatsCollection.insertOne(newChat);

    return NextResponse.json({ chatId }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/chats - List all chats
export async function GET() {
  try {
    const db = await getDatabase();
    const chatsCollection = db.collection<Chat>('chats');
    
    const chats = await chatsCollection
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
