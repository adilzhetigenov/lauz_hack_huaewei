# 🚀 Barakcha - AI Document Intelligence

A powerful GenAI application that transforms lengthy documents into instant insights, summaries, and interactive Q&A.

## ✨ Features

- **📄 Document Upload**: Drag & drop PDF and text files (up to 10MB)
- **✨ AI Summary**: Generate concise 3-sentence summaries with key bullet points
- **💬 Interactive Q&A**: Ask questions about document content with source citations
- **🔍 Insights Extraction**: Automatically extract:
  - Important dates and deadlines
  - People mentioned
  - Organizations/companies
  - Action items and tasks
  - Key statistics and numbers
- **🌙 Dark Mode**: Automatic dark mode support
- **📱 Responsive**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 API
- **PDF Processing**: pdf-parse
- **UI Components**: Lucide React icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_NAME=Barakcha
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
barakcha/
├── app/
│   ├── api/                    # API routes
│   │   ├── upload/            # File upload endpoint
│   │   ├── summarize/         # Summary generation
│   │   ├── chat/              # Q&A endpoint
│   │   └── extract-insights/  # Insights extraction
│   ├── components/            # React components
│   │   ├── DocumentUpload.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── QAChat.tsx
│   │   └── InsightsPanel.tsx
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main page
│   └── globals.css            # Global styles
├── lib/                       # Utility functions
│   ├── openai.ts             # OpenAI client & AI functions
│   └── pdfParser.ts          # PDF/text parsing
└── [config files]
```

## 🎯 How It Works

1. **Upload**: User uploads a PDF or text file
2. **Extract**: Text is extracted from the document
3. **Process**: AI processes the text for:
   - Summary generation
   - Q&A context preparation
   - Insights extraction
4. **Interact**: User can generate summaries, ask questions, and view insights

## 💡 Usage Examples

### Generate Summary
1. Upload a document
2. Click "Generate Summary"
3. Get instant 3-sentence summary + key points

### Ask Questions
1. Upload a document
2. Type questions in the chat (e.g., "What are the main findings?")
3. Get answers with source citations

### Extract Insights
1. Upload a document
2. Click "Extract Insights"
3. Browse dates, people, organizations, action items, and statistics

## 🔧 Configuration

### Using Different AI Models

Edit `lib/openai.ts` to change the model:

```typescript
// For cheaper/faster (development):
model: 'gpt-3.5-turbo'

// For better quality (production):
model: 'gpt-4-turbo-preview'
```

### Adjusting File Size Limits

Edit `next.config.js`:

```javascript
serverActions: {
  bodySizeLimit: '20mb', // Increase from 10mb
}
```

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add `OPENAI_API_KEY` in environment variables
4. Deploy!

### Other Platforms

Works on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 💰 Cost Estimation

**OpenAI GPT-4:**
- Average document (10 pages): ~$0.10-0.20
- Free tier: $5 credit = ~25-50 documents

**OpenAI GPT-3.5-turbo (cheaper option):**
- Average document: ~$0.01-0.02
- Free tier: $5 credit = ~250-500 documents

## 🐛 Troubleshooting

### "Failed to process file"
- Check file size (< 10MB)
- Ensure PDF/text format
- Check browser console for details

### "OpenAI API error"
- Verify API key in `.env.local`
- Check OpenAI account credits
- Ensure API key has proper permissions

### Build errors
- Delete `node_modules` and `.next`
- Run `npm install` again
- Check Node.js version (18+)

## 📝 License

MIT License - feel free to use for your hackathon!

## 🙏 Acknowledgments

- Built for GenAI Hackathon
- Powered by OpenAI
- UI inspired by modern design systems

---

**Ready to transform documents into insights? Start building! 🎉**

