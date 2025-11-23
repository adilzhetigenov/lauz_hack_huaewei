import { NextRequest, NextResponse } from 'next/server';
import { answerQuestion } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { text, question, conversationHistory } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Document text is required' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const result = await answerQuestion(
      text, 
      question.trim(),
      conversationHistory || []
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to answer question: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

