import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key is set
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
  console.error('⚠️  GEMINI_API_KEY is not set or is still the placeholder value.');
  console.error('   Please set your Gemini API key in .env.local file.');
  console.error('   Get your API key from: https://makersuite.google.com/app/apikey');
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(apiKey || '');

// Get the model (default to gemini-1.5-flash, fallback to gemini-1.5-pro)
function getModel() {
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.');
  }
  // Use gemini-1.5-flash as default (faster and cheaper) or gemini-1.5-pro for better quality
  // Old model names like 'gemini-pro' are deprecated
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  return genAI.getGenerativeModel({ model: modelName });
}

export async function generateSummary(text: string): Promise<string> {
  try {
    const model = getModel();
    
    const prompt = `You are a document summarization expert. Create concise, accurate summaries with key insights.

Summarize this document in exactly 3 sentences, then provide 5-7 key bullet points:

${text.substring(0, 30000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || 'Summary generation failed';
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    // Check for model not found errors
    if (error?.message?.includes('not found') || error?.message?.includes('404')) {
      throw new Error('Model not found. Please check GEMINI_MODEL in .env.local. Try: gemini-1.5-flash or gemini-1.5-pro');
    }
    
    throw new Error('Failed to generate summary: ' + (error?.message || 'Unknown error'));
  }
}

export async function answerQuestion(
  text: string, 
  question: string, 
  conversationHistory: Array<{role: string, content: string}> = []
): Promise<{answer: string, source: string}> {
  try {
    const model = getModel();
    
    // Simple chunking for RAG - in production, use proper vector embeddings
    const chunks = chunkText(text, 2000);
    
    // Find most relevant chunk (simple keyword matching for MVP)
    const relevantChunk = findRelevantChunk(chunks, question);
    
    // Build conversation context from history
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\nPrevious conversation:\n';
      conversationHistory.forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    const prompt = `You are a helpful assistant that answers questions based on the provided document context. Always cite which part of the document you used.

Document context:

${relevantChunk}${conversationContext}

Question: ${question}

Answer the question based on the document context above. If the answer is not in the context, say so.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    return {
      answer: answer || 'Unable to generate answer',
      source: relevantChunk.substring(0, 200) + '...',
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    if (error?.message?.includes('not found') || error?.message?.includes('404')) {
      throw new Error('Model not found. Please check GEMINI_MODEL in .env.local. Try: gemini-1.5-flash or gemini-1.5-pro');
    }
    
    throw new Error('Failed to answer question: ' + (error?.message || 'Unknown error'));
  }
}

export async function extractInsights(text: string): Promise<{
  dates: string[];
  people: string[];
  organizations: string[];
  actionItems: string[];
  keyStats: string[];
}> {
  try {
    const model = getModel();
    
    const prompt = `You are an expert at extracting structured information from documents. Return JSON format only.

Extract the following from this document and return as JSON:
- dates: Array of important dates and deadlines
- people: Array of people mentioned
- organizations: Array of organizations/companies mentioned
- actionItems: Array of tasks or action items
- keyStats: Array of important statistics or numbers

Document:

${text.substring(0, 30000)}

Return only valid JSON, no markdown formatting. Format: {"dates": [], "people": [], "organizations": [], "actionItems": [], "keyStats": []}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // Clean up the response (remove markdown code blocks if present)
    let jsonText = content.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonText);
    return {
      dates: parsed.dates || [],
      people: parsed.people || [],
      organizations: parsed.organizations || [],
      actionItems: parsed.actionItems || [],
      keyStats: parsed.keyStats || [],
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    if (error?.message?.includes('not found') || error?.message?.includes('404')) {
      throw new Error('Model not found. Please check GEMINI_MODEL in .env.local. Try: gemini-1.5-flash or gemini-1.5-pro');
    }
    
    return {
      dates: [],
      people: [],
      organizations: [],
      actionItems: [],
      keyStats: [],
    };
  }
}

function chunkText(text: string, chunkSize: number = 2000): string[] {
  const chunks: string[] = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  
  return chunks.length > 0 ? chunks : [text];
}

function findRelevantChunk(chunks: string[], question: string): string {
  // Simple keyword matching - in production, use semantic search with embeddings
  const questionWords = question.toLowerCase().split(/\s+/);
  let bestChunk = chunks[0];
  let maxMatches = 0;

  for (const chunk of chunks) {
    const chunkLower = chunk.toLowerCase();
    const matches = questionWords.filter(word => 
      word.length > 3 && chunkLower.includes(word)
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestChunk = chunk;
    }
  }

  return bestChunk;
}

export async function checkSwissLegalCompliance(text: string): Promise<{
  overallCompliance: 'compliant' | 'non-compliant' | 'needs-review';
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    category: string;
    description: string;
    relevantLaw?: string;
    recommendation?: string;
  }>;
  summary: string;
  applicableLaws: string[];
}> {
  try {
    const model = getModel();
    
    const prompt = `You are a Swiss legal compliance expert. Analyze the following document against Swiss laws and regulations. Focus on:

1. Data Protection (DSG - Datenschutzgesetz, GDPR compliance in Switzerland)
2. Employment Law (OR - Obligationenrecht, Labor Law)
3. Contract Law (Swiss Code of Obligations)
4. Consumer Protection (Konsumentenschutzgesetz)
5. Corporate Law (OR, Aktiengesetz)
6. Financial Regulations (FINMA regulations)
7. Privacy and Data Security
8. Anti-discrimination laws
9. Environmental regulations (Umweltschutzgesetz)
10. Tax compliance (Swiss tax law)

Document:

${text.substring(0, 30000)}

Analyze the document and return a JSON object with:
- overallCompliance: "compliant", "non-compliant", or "needs-review"
- issues: Array of objects with:
  - severity: "critical", "warning", or "info"
  - category: The legal area (e.g., "Data Protection", "Employment Law")
  - description: Clear description of the issue
  - relevantLaw: The specific Swiss law or regulation (if applicable)
  - recommendation: Suggested action (if applicable)
- summary: A brief 2-3 sentence summary of compliance status
- applicableLaws: Array of Swiss laws that are relevant to this document

Return only valid JSON, no markdown formatting. Format:
{
  "overallCompliance": "compliant" | "non-compliant" | "needs-review",
  "issues": [
    {
      "severity": "critical" | "warning" | "info",
      "category": "string",
      "description": "string",
      "relevantLaw": "string (optional)",
      "recommendation": "string (optional)"
    }
  ],
  "summary": "string",
  "applicableLaws": ["string"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // Clean up the response
    let jsonText = content.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonText);
    
    return {
      overallCompliance: parsed.overallCompliance || 'needs-review',
      issues: parsed.issues || [],
      summary: parsed.summary || 'Compliance check completed.',
      applicableLaws: parsed.applicableLaws || [],
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    if (error?.message?.includes('not found') || error?.message?.includes('404')) {
      throw new Error('Model not found. Please check GEMINI_MODEL in .env.local. Try: gemini-1.5-flash or gemini-1.5-pro');
    }
    
    return {
      overallCompliance: 'needs-review',
      issues: [{
        severity: 'info',
        category: 'System Error',
        description: 'Unable to complete legal compliance check. Please try again.',
      }],
      summary: 'An error occurred during the compliance check.',
      applicableLaws: [],
    };
  }
}
