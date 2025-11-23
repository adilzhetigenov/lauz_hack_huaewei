# Barakcha Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_NAME=Barakcha
```

**Get your Google Gemini API key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy and paste it into `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
barakcha/
├── app/
│   ├── api/              # API routes
│   │   ├── upload/
│   │   ├── summarize/
│   │   ├── chat/
│   │   └── extract-insights/
│   ├── components/       # React components
│   │   ├── DocumentUpload.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── QAChat.tsx
│   │   └── InsightsPanel.tsx
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
├── lib/                 # Utility functions
│   ├── openai.ts        # OpenAI client & functions
│   └── pdfParser.ts     # PDF parsing utilities
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Features

- ✅ **Document Upload**: Drag & drop PDF and text files
- ✅ **AI Summary**: Generate concise summaries with key points
- ✅ **Interactive Q&A**: Ask questions about document content
- ✅ **Insights Extraction**: Automatically extract dates, people, organizations, action items, and statistics
- ✅ **Dark Mode**: Automatic dark mode support
- ✅ **Responsive Design**: Works on desktop and mobile

## Testing

1. **Upload a PDF**: Try uploading a research paper or document
2. **Generate Summary**: Click "Generate Summary" button
3. **Ask Questions**: Type questions in the chat interface
4. **Extract Insights**: Click "Extract Insights" to see structured data

## Troubleshooting

### Issue: "Failed to process file"
- Check file size (must be < 10MB)
- Ensure file is PDF or text format
- Check console for detailed error messages

### Issue: "OpenAI API error"
- Verify your API key is correct in `.env.local`
- Check you have credits in your OpenAI account
- Ensure API key has proper permissions

### Issue: Build errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall
- Check Node.js version (requires 18+)

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Environment Variables for Production

Make sure to add `OPENAI_API_KEY` in your deployment platform's environment variables section.

## Cost Estimation

Using OpenAI GPT-4:
- Average document (10 pages): ~$0.10-0.20 per document
- Free tier: $5 credit = ~25-50 documents

**Tip**: For development/testing, consider using `gpt-3.5-turbo` in `lib/openai.ts` for 10x cost savings.

## Next Steps

- Add user authentication
- Implement document history
- Add batch processing
- Integrate with cloud storage (Google Drive, Dropbox)
- Add export functionality (PDF, Word, etc.)

