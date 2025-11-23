import { NextRequest, NextResponse } from 'next/server';
import { extractInsights } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Document text is required' },
        { status: 400 }
      );
    }

    if (text.length < 100) {
      return NextResponse.json(
        { error: 'Document text is too short (minimum 100 characters)' },
        { status: 400 }
      );
    }

    const insights = await extractInsights(text);
    
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Insights extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract insights: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

