import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Supported file types
export const SUPPORTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain',
  'text/markdown',
];

export const SUPPORTED_FILE_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md'];

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    const extractedText = data.text || '';
    
    // Log extraction info for debugging
    console.log('PDF extraction:', {
      textLength: extractedText.length,
      numPages: data.numpages,
      info: data.info,
    });
    
    // If no text extracted, check if it might be an image-based PDF
    if (!extractedText || extractedText.trim().length === 0) {
      console.warn('PDF appears to have no extractable text - may be image-based (scanned)');
    }
    
    return extractedText;
  } catch (error) {
    console.error('PDF parsing error details:', error);
    throw new Error('Failed to parse PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (error) {
    throw new Error('Failed to parse DOCX: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export function extractTextFromTXT(text: string): string {
  return text;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check by extension first (more reliable than MIME type)
  const fileName = file.name.toLowerCase();
  const hasValidExtension = SUPPORTED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return { 
      valid: false, 
      error: `Unsupported file type. Please upload PDF, DOCX, TXT, or MD files only. Received: ${file.name}` 
    };
  }

  // Also check MIME type if available (but don't fail if it's empty - extension check is primary)
  if (file.type && file.type !== '' && !SUPPORTED_FILE_TYPES.includes(file.type)) {
    // If MIME type is set but doesn't match, log warning but allow if extension is valid
    console.warn(`MIME type mismatch for ${file.name}: ${file.type} but extension is valid`);
  }

  return { valid: true };
}

export function getFileType(file: File): 'pdf' | 'docx' | 'txt' | 'md' {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) return 'pdf';
  if (fileName.endsWith('.docx')) return 'docx';
  if (fileName.endsWith('.md')) return 'md';
  return 'txt';
}

