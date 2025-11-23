import { NextRequest, NextResponse } from 'next/server';
import { 
  extractTextFromPDF, 
  extractTextFromDOCX, 
  extractTextFromTXT,
  validateFile,
  getFileType,
  SUPPORTED_FILE_TYPES 
} from '@/lib/pdfParser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Log file info for debugging
    console.log('File upload:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validate file type
    const validation = validateFile(file);
    if (!validation.valid) {
      console.log('Validation failed:', validation.error);
      return NextResponse.json(
        { error: validation.error || 'Invalid file type' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text: string;
    const fileType = getFileType(file);

    try {
      switch (fileType) {
        case 'pdf':
          text = await extractTextFromPDF(buffer);
          console.log(`PDF extraction result: ${text ? text.length : 0} characters extracted`);
          break;
        case 'docx':
          text = await extractTextFromDOCX(buffer);
          console.log(`DOCX extraction result: ${text ? text.length : 0} characters extracted`);
          break;
        case 'txt':
        case 'md':
          text = extractTextFromTXT(buffer.toString('utf-8'));
          console.log(`Text file: ${text ? text.length : 0} characters`);
          break;
        default:
          return NextResponse.json(
            { error: 'Unsupported file type. Only PDF, DOCX, TXT, and MD files are supported.' },
            { status: 400 }
          );
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      return NextResponse.json(
        { error: `Failed to parse ${fileType.toUpperCase()} file: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Check if text was extracted
    if (!text) {
      return NextResponse.json(
        { error: 'Could not extract text from the file. The file may be image-based (scanned PDF) or corrupted. Please ensure the file contains selectable text.' },
        { status: 400 }
      );
    }

    const textLength = text.trim().length;
    console.log(`Extracted text length: ${textLength} characters`);

    // Lower the minimum requirement and provide helpful error
    if (textLength < 20) {
      return NextResponse.json(
        { error: `Only ${textLength} characters were extracted from the file. The file may be image-based (scanned PDF), password-protected, or contain very little text. Please ensure the file contains selectable text.` },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      text,
      fileName: file.name,
      fileSize: file.size,
      fileType: fileType,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

