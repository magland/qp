import { NextResponse } from "next/server";
import { getDatabase } from "../../../lib/mongodb";
import { Chat } from "../../../types";

// POST /api/chats - Create a new chat with complete content
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chat: Chat = body;

    if (!chat.app || typeof chat.app !== "string") {
      return NextResponse.json(
        { error: "app is required and must be a string" },
        { status: 400 },
      );
    }

    if (!Array.isArray(chat.messages)) {
      return NextResponse.json(
        { error: "messages must be an array" },
        { status: 400 },
      );
    }

    // Generate chatId based on app
    let prefix = "chat_";
    if (chat.app === "stan-assistant") {
      prefix = "st_";
    } else if (chat.app === "nwb-assistant") {
      prefix = "nwb_";
    } else if (chat.app === "neurosift-chat") {
      prefix = "ns_";
    } else if (chat.app === "dandiset-explorer") {
      prefix = "de_";
    } else if (chat.app === "figpack-assistant") {
      prefix = "fa_";
    } else if (chat.app === "test-chat") {
      prefix = "tc_";
    }
    const chatId = `${prefix}${Date.now()}`;
    const now = new Date();

    // Create the complete chat object with generated fields
    const newChat: Chat = {
      ...chat,
      chatId,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDatabase();
    const chatsCollection = db.collection<Chat>("chats");

    await chatsCollection.insertOne(newChat);

    return NextResponse.json({ chatId }, { status: 201 });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/chats - List all chats for a specific app
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const app = searchParams.get("app");

    if (!app) {
      return NextResponse.json(
        { error: "app parameter is required" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const chatsCollection = db.collection<Chat>("chats");

    const chats = await chatsCollection
      .find({ app })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
