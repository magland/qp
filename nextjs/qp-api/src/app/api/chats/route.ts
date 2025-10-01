import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";
import { Chat } from "../../../types";

// POST /api/chats - Create a new chat
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { initialPrompt, app } = body;

    if (!initialPrompt || typeof initialPrompt !== 'string') {
      return NextResponse.json(
        { error: "initialPrompt is required and must be a string" },
        { status: 400 }
      );
    }

    if (!app || typeof app !== 'string') {
      return NextResponse.json(
        { error: "app is required and must be a string" },
        { status: 400 }
      );
    }

    let prefix = 'chat_';
    if (app === 'stan-assistant') {
      prefix = 'st_';
    }
    else if (app === 'nwb-assistant') {
      prefix = 'nwb_';
    }
    else if (app === 'neurosift-chat') {
      prefix = 'ns_';
    }
    const chatId = `${prefix}${Date.now()}`;
    const now = new Date();

    const newChat: Chat = {
      app,
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

// GET /api/chats - List all chats for a specific app
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const app = searchParams.get('app');

    if (!app) {
      return NextResponse.json(
        { error: "app parameter is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const chatsCollection = db.collection<Chat>('chats');
    
    const chats = await chatsCollection
      .find({ app })
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
