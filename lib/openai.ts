import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(text: string): Promise<string> {
  // Use GPT-3.5-turbo for cost efficiency (10x cheaper)
  // Change to 'gpt-4-turbo-preview' for better quality if needed
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are a document summarization expert. Create concise, accurate summaries with key insights.',
      },
      {
        role: 'user',
        content: `Summarize this document in exactly 3 sentences, then provide 5-7 key bullet points:\n\n${text.substring(0, 15000)}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });
  return response.choices[0].message.content || 'Summary generation failed';
}

export async function answerQuestion(text: string, question: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<{answer: string, source: string}> {
  // Simple chunking for RAG - in production, use proper vector embeddings
  const chunks = chunkText(text, 2000);
  
  // Find most relevant chunk (simple keyword matching for MVP)
  const relevantChunk = findRelevantChunk(chunks, question);
  
  const messages = [
    {
      role: 'system' as const,
      content: 'You are a helpful assistant that answers questions based on the provided document context. Always cite which part of the document you used.',
    },
    ...conversationHistory,
    {
      role: 'user' as const,
      content: `Document context:\n\n${relevantChunk}\n\nQuestion: ${question}\n\nAnswer the question based on the document context above. If the answer is not in the context, say so.`,
    },
  ];

  // Use GPT-3.5-turbo for cost efficiency
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  
  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.5,
    max_tokens: 500,
  });

  return {
    answer: response.choices[0].message.content || 'Unable to generate answer',
    source: relevantChunk.substring(0, 200) + '...',
  };
}

export async function extractInsights(text: string): Promise<{
  dates: string[];
  people: string[];
  organizations: string[];
  actionItems: string[];
  keyStats: string[];
}> {
  // Use GPT-3.5-turbo for cost efficiency
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert at extracting structured information from documents. Return JSON format only.',
      },
      {
        role: 'user',
        content: `Extract the following from this document and return as JSON:
- dates: Array of important dates and deadlines
- people: Array of people mentioned
- organizations: Array of organizations/companies mentioned
- actionItems: Array of tasks or action items
- keyStats: Array of important statistics or numbers

Document:\n\n${text.substring(0, 15000)}

Return only valid JSON, no markdown formatting.`,
      },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  try {
    const content = response.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);
    return {
      dates: parsed.dates || [],
      people: parsed.people || [],
      organizations: parsed.organizations || [],
      actionItems: parsed.actionItems || [],
      keyStats: parsed.keyStats || [],
    };
  } catch (error) {
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

