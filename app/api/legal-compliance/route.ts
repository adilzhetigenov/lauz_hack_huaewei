import { NextRequest, NextResponse } from 'next/server';
import { checkSwissLegalCompliance } from '@/lib/gemini';

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

    const compliance = await checkSwissLegalCompliance(text);
    
    return NextResponse.json(compliance);
  } catch (error) {
    console.error('Legal compliance check error:', error);
    return NextResponse.json(
      { error: 'Failed to check legal compliance: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

