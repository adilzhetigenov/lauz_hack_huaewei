# Quick Reference Guide

## 🚀 Start Building in 3 Steps

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. Run the app
npm run dev
```

## 📋 File Checklist

✅ **Configuration Files**
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind CSS config
- `next.config.js` - Next.js config
- `.eslintrc.json` - ESLint config

✅ **Core Application**
- `app/page.tsx` - Main page
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles

✅ **Components**
- `app/components/DocumentUpload.tsx` - File upload
- `app/components/SummaryCard.tsx` - Summary generation
- `app/components/QAChat.tsx` - Q&A interface
- `app/components/InsightsPanel.tsx` - Insights extraction

✅ **API Routes**
- `app/api/upload/route.ts` - File processing
- `app/api/summarize/route.ts` - Summary API
- `app/api/chat/route.ts` - Q&A API
- `app/api/extract-insights/route.ts` - Insights API

✅ **Libraries**
- `lib/openai.ts` - OpenAI client & functions
- `lib/pdfParser.ts` - PDF/text parsing

## 🎯 Key Features Implemented

1. ✅ Document upload (PDF, TXT)
2. ✅ Text extraction
3. ✅ AI-powered summarization
4. ✅ Interactive Q&A with RAG
5. ✅ Structured insights extraction
6. ✅ Dark mode support
7. ✅ Responsive design
8. ✅ Error handling
9. ✅ Loading states
10. ✅ Source citations

## 🔑 Environment Variables

Required in `.env.local`:
```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_NAME=Barakcha
```

## 📦 Key Dependencies

- `next` - React framework
- `openai` - OpenAI API client
- `pdf-parse` - PDF text extraction
- `react-markdown` - Markdown rendering
- `lucide-react` - Icons
- `tailwindcss` - Styling

## 🎨 Customization Tips

### Change AI Model
Edit `lib/openai.ts`:
```typescript
model: 'gpt-3.5-turbo' // Cheaper
// or
model: 'gpt-4-turbo-preview' // Better quality
```

### Adjust Summary Length
Edit `lib/openai.ts` → `generateSummary()`:
```typescript
max_tokens: 1000 // Increase for longer summaries
```

### Change File Size Limit
Edit `next.config.js`:
```javascript
bodySizeLimit: '20mb'
```

## 🐛 Common Issues

| Issue | Solution |
|------|----------|
| API key error | Check `.env.local` exists and has correct key |
| PDF parsing fails | Ensure file is valid PDF, not scanned image |
| Build fails | Delete `node_modules` and `.next`, reinstall |
| Port 3000 in use | Use `npm run dev -- -p 3001` |

## 📊 Demo Flow

1. Upload sample PDF (research paper, contract, etc.)
2. Show summary generation
3. Ask 2-3 questions
4. Extract and show insights
5. Highlight source citations

## 🚢 Deployment Checklist

- [ ] Set `OPENAI_API_KEY` in deployment platform
- [ ] Test all features in production
- [ ] Verify file upload limits
- [ ] Check API rate limits
- [ ] Test on mobile devices

## 💡 Pro Tips

1. **Use GPT-3.5-turbo for development** (10x cheaper)
2. **Prepare sample documents** for demo
3. **Test error handling** with invalid files
4. **Monitor API costs** during development
5. **Have backup demo** (screenshots/video) ready

---

**You're all set! Happy hacking! 🎉**

