import { NextRequest, NextResponse } from 'next/server';
import { conversationalChat, ConversationalChatInputSchema } from '@/ai/flows/conversational-chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input
    const validatedInput = ConversationalChatInputSchema.parse(body);
    
    const result = await conversationalChat(validatedInput);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Conversational chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}