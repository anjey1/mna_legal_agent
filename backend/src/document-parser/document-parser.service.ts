/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as pdfjsLib from 'pdf-parse';
import * as mammoth from 'mammoth';
import { Buffer } from 'buffer';

export interface DocumentSection {
    type: 'header' | 'paragraph';
    content: string;
    level?: number;
}

@Injectable()
export class DocumentParserService {
    async parsePdf(buffer: Buffer): Promise<DocumentSection[]> {
        try {
            const pdfData = await pdfjsLib(buffer);
            return this.parseTextToSections(pdfData.text);
        } catch (error: unknown) {
            throw new Error(`PDF parsing error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async parseDocx(buffer: Buffer): Promise<DocumentSection[]> {
        try {
            const result = await mammoth.extractRawText({ buffer });
            return this.parseTextToSections(result.value);
        } catch (error: unknown) {
            throw new Error(`DOCX parsing error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private parseTextToSections(text: string): DocumentSection[] {
        const lines = text.split('\n');
        const sections: DocumentSection[] = [];
        let currentSection: DocumentSection | null = null;

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Detect headers (simple heuristic)
            if (trimmedLine.match(/^(SECTION|ARTICLE|SCHEDULE|PART|CHAPTER)\s*\d+/i)) {
                // Close previous section if exists
                if (currentSection) {
                    sections.push(currentSection);
                }
                const h2Match = trimmedLine.match(/^(H2|Heading 2)\s*(.+)$/i);

                currentSection = {
                    type: h2Match ? 'header' : 'paragraph',
                    content: trimmedLine,
                    level: 1
                };
            } else if (trimmedLine) {
                // If no current section, create a paragraph
                if (!currentSection) {
                    currentSection = {
                        type: 'paragraph',
                        content: trimmedLine
                    };
                } else {
                    // Append to existing section
                    currentSection.content += ' ' + trimmedLine;
                }
            } else if (currentSection) {
                // Empty line indicates end of a section
                sections.push(currentSection);
                currentSection = null;
            }
        }

        // Add last section if exists
        if (currentSection) {
            sections.push(currentSection);
        }

        return sections;
    }

    async extractText(file: Express.Multer.File): Promise<DocumentSection[]> {
        const buffer = file.buffer;
        const fileType = file.mimetype;

        // Add support for text files during testing
        const isTestEnvironment = process.env.NODE_ENV === 'test';

        switch (fileType) {
            case 'application/pdf':
                return this.parsePdf(buffer);
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return this.parseDocx(buffer);
            case 'text/plain':
            case 'text/markdown':
                if (isTestEnvironment) {
                    return this.parseTextFile(buffer);
                }
                throw new Error('Text files not supported outside test environment');
            default:
                throw new Error(`Unsupported file type: ${fileType}`);
        }
    }

    // New method to parse text files
    private parseTextFile(buffer: Buffer): DocumentSection[] {
        const text = buffer.toString('utf-8');
        return this.parseTextToSections(text);
    }
} 