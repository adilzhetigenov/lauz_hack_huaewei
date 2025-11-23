# Barakcha - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Google Gemini API key (get one at https://makersuite.google.com/app/apikey)
- Basic familiarity with React/Next.js

## Setup Instructions

### 1. Initialize Project

```bash
npx create-next-app@latest barakcha --typescript --tailwind --app --no-src-dir
cd barakcha
```

### 2. Install Dependencies

```bash
npm install openai pdf-parse react-markdown lucide-react
npm install -D @types/pdf-parse
```

### 3. Set Up Environment Variables

Create `.env.local` file:

```env
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_NAME=Barakcha
```

### 4. Project Structure

```
barakcha/
├── app/
│   ├── api/
│   │   ├── summarize/
│   │   │   └── route.ts
│   │   ├── chat/
│   │   │   └── route.ts
│   │   └── extract-insights/
│   │       └── route.ts
│   ├── components/
│   │   ├── DocumentUpload.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── QAChat.tsx
│   │   └── InsightsPanel.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── openai.ts
│   └── pdfParser.ts
└── .env.local
```

## Key Implementation Files

### `lib/openai.ts` - OpenAI Client

```typescript
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a document summarization expert. Create concise, accurate summaries.',
      },
      {
        role: 'user',
        content: `Summarize this document in 3 sentences, then provide 5-7 key bullet points:\n\n${text}`,
      },
    ],
    temperature: 0.3,
  });
  return response.choices[0].message.content;
}
```

### `lib/pdfParser.ts` - PDF Text Extraction

```typescript
import pdf from 'pdf-parse';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

export function chunkText(text: string, chunkSize: number = 2000): string[] {
  const chunks: string[] = [];
  const words = text.split(' ');
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  
  return chunks;
}
```

### `app/api/summarize/route.ts` - Summary API

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateSummary } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || text.length < 100) {
      return NextResponse.json(
        { error: 'Document text is too short' },
        { status: 400 }
      );
    }

    const summary = await generateSummary(text);
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
```

### `app/components/DocumentUpload.tsx` - Upload Component

```typescript
'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function DocumentUpload({ onFileProcessed }: { onFileProcessed: (text: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const { text } = await response.json();
      onFileProcessed(text);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-4 text-lg">Drag & drop PDF or click to upload</p>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="mt-2 cursor-pointer text-blue-600 hover:text-blue-800"
      >
        Choose file
      </label>
      {isProcessing && <p className="mt-4 text-gray-500">Processing...</p>}
    </div>
  );
}
```

## Testing Checklist

- [ ] PDF upload works
- [ ] Text extraction successful
- [ ] Summary generation returns results
- [ ] Q&A responds with relevant answers
- [ ] Insights extraction works
- [ ] UI is responsive
- [ ] Error handling works
- [ ] Loading states display correctly

## Tips for Hackathon Success

1. **Start Simple**: Get basic PDF upload + summary working first
2. **Use GPT-3.5-turbo**: Cheaper and faster for development/testing
3. **Mock Data**: Create sample responses for demo if API fails
4. **Focus on UX**: Polish one feature well vs. many half-baked features
5. **Prepare Backup**: Have screenshots/video ready if live demo fails

## Common Issues & Solutions

**Issue**: PDF parsing fails
- **Solution**: Check file size, use try-catch, validate file type

**Issue**: OpenAI API rate limits
- **Solution**: Add retry logic, use exponential backoff

**Issue**: Large documents timeout
- **Solution**: Process in chunks, show progress, limit file size

## Demo Data

Prepare these sample documents:
1. Research paper (10-20 pages)
2. Meeting notes (2-3 pages)
3. Legal contract excerpt (5-10 pages)

Store them in `/public/samples/` for quick demo access.

