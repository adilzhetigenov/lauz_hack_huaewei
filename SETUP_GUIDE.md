# Barakcha Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_NAME=Barakcha

# Optional: Choose Gemini model (default is gemini-pro)
# GEMINI_MODEL=gemini-pro
```

**Get your Google Gemini API key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste it into `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
BackUp/
├── app/
│   ├── api/              # API routes
│   │   ├── upload/       # File upload & text extraction
│   │   ├── summarize/    # Generate document summary
│   │   ├── chat/         # Q&A with document
│   │   └── extract-insights/  # Extract structured insights
│   ├── components/       # React components
│   │   ├── DocumentUpload.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── QAChat.tsx
│   │   └── InsightsPanel.tsx
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── globals.css       # Global styles
├── lib/
│   ├── openai.ts         # OpenAI API client & functions
│   └── pdfParser.ts      # PDF/text file parsing
├── package.json
└── tsconfig.json
```

## Features

### ✅ Document Upload
- Supports PDF, TXT, and Markdown files
- Drag & drop interface
- Max file size: 10MB
- Automatic text extraction

### ✅ AI Summary
- 3-sentence executive summary
- 5-7 key bullet points
- Copy to clipboard
- One-click generation

### ✅ Interactive Q&A
- Ask questions about document content
- Conversation history
- Source citations
- RAG-based answers

### ✅ Key Insights Extraction
- Important dates and deadlines
- People mentioned
- Organizations/companies
- Action items
- Key statistics

## Model Configuration

By default, the app uses **gemini-pro** which is:
- Free tier available (generous free quota)
- Fast response times
- High quality for document processing

**Gemini API Benefits:**
- Free tier: 60 requests per minute
- No credit card required for free tier
- Excellent document understanding capabilities

To use a different model:
```env
GEMINI_MODEL=gemini-pro-vision  # For image + text
```

## Troubleshooting

### Issue: "Failed to process file"
- Check file size (must be < 10MB)
- Ensure file is PDF, TXT, or Markdown
- Check server logs for detailed error

### Issue: "Gemini API error"
- Verify `GEMINI_API_KEY` is set in `.env.local`
- Check API key is valid and has credits
- Ensure you're not hitting rate limits
- Check that the API key has proper permissions

### Issue: "Module not found"
- Run `npm install` to install dependencies
- Delete `node_modules` and `.next`, then reinstall

### Issue: PDF parsing fails
- Some PDFs may be image-based (scanned)
- Try a text-based PDF
- Check file isn't corrupted

## Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_NAME` (optional)
5. Deploy!

### Environment Variables on Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `GEMINI_API_KEY` with your API key
4. Redeploy

## Testing the App

1. **Upload a document**: Use a PDF or text file
2. **Generate summary**: Click "Generate Summary"
3. **Ask questions**: Try "What are the main findings?"
4. **Extract insights**: Click "Extract Insights"

## Demo Tips

1. **Prepare sample documents**:
   - Research paper (10-20 pages)
   - Meeting notes (2-3 pages)
   - Legal contract excerpt (5-10 pages)

2. **Test all features** before demo
3. **Have backup screenshots** in case of API issues
4. **Show the upload → summary → Q&A flow**

## Next Steps

- Add user authentication
- Support for more file types (DOCX, etc.)
- Batch document processing
- Export insights to CSV/JSON
- Integration with cloud storage (Google Drive, Dropbox)

