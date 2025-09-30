import { NextResponse } from "next/server";
import { getDatabase } from "../../../../lib/mongodb";
import { Chat } from "../../../../types";

// GET /api/chats/[chatId] - Get a specific chat
export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;

    const db = await getDatabase();
    const chatsCollection = db.collection<Chat>('chats');
    
    const chat = await chatsCollection.findOne({ chatId });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/chats/[chatId] - Update a chat
export async function PUT(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;
    const body = await request.json();
    const updatedChat: Chat = body;

    // Ensure the chatId in the URL matches the chatId in the body
    if (updatedChat.chatId !== chatId) {
      return NextResponse.json(
        { error: "chatId mismatch" },
        { status: 400 }
      );
    }

    // Update the updatedAt timestamp
    updatedChat.updatedAt = new Date();

    const db = await getDatabase();
    const chatsCollection = db.collection<Chat>('chats');
    
    // Remove _id field if it exists (MongoDB's _id is immutable)
    const { _id, ...chatWithoutId } = updatedChat as any;
    
    const result = await chatsCollection.replaceOne(
      { chatId },
      chatWithoutId
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating chat:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/chats/[chatId] - Delete a chat (requires admin key)
export async function DELETE(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;
    
    // Verify admin key
    const adminKey = request.headers.get('x-admin-key');
    const expectedAdminKey = process.env.ADMIN_KEY;
    
    if (!expectedAdminKey) {
      return NextResponse.json(
        { error: "Admin key not configured on server" },
        { status: 500 }
      );
    }
    
    if (!adminKey || adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid admin key" },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const chatsCollection = db.collection<Chat>('chats');
    
    const result = await chatsCollection.deleteOne({ chatId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
