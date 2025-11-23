import { NextRequest, NextResponse } from 'next/server';
import { generateSummary } from '@/lib/gemini';

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

    const summary = await generateSummary(text);
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summary generation error:', error);
    
    // Check for API key errors
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'Gemini API key is invalid or not set. Please check your .env.local file and ensure GEMINI_API_KEY is configured correctly.' },
          { status: 500 }
        );
      }
      if (error.message.includes('not configured')) {
        return NextResponse.json(
          { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file. Get your key from: https://makersuite.google.com/app/apikey' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate summary: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

