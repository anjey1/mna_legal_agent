/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DocumentParserService } from './document-parser.service';
import { ClaudeService } from '../claude/claude.service';
import * as fs from 'fs';
import * as path from 'path';

describe('Document Processing Integration', () => {
    let documentParserService: DocumentParserService;
    let claudeService: ClaudeService;

    beforeAll(async () => {
        try {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            }).compile();

            documentParserService = moduleFixture.get<DocumentParserService>(DocumentParserService);
            claudeService = moduleFixture.get<ClaudeService>(ClaudeService);
        } catch (error) {
            console.error('Error setting up test module:', error);
            throw error;
        }
    });

    it('should process contract_c.txt and extract correct deal terms', async () => {
        try {
            // Read the contract file
            const filePath = path.join(__dirname, '../docs/contract_c.txt');
            console.log('File path:', filePath);

            // Verify file exists
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }

            const fileBuffer = fs.readFileSync(filePath);

            // Create a mock Express.Multer.File object
            const mockFile = {
                buffer: fileBuffer,
                originalname: 'contract_c.txt',
                mimetype: 'text/plain', // Explicitly set to text/plain
                size: fileBuffer.length,
            } as Express.Multer.File;

            // Ensure test environment is set
            process.env.NODE_ENV = 'test';

            // Extract document sections
            const documentSections = await documentParserService.extractText(mockFile);
            console.log('Document Sections:', JSON.stringify(documentSections, null, 2));

            // Process document with Claude service
            const result = await claudeService.processDocument(documentSections);
            console.log('Processing Result:', JSON.stringify(result, null, 2));

            // Assertions for deal terms
            expect(result.dealTerms).toBeDefined();
            expect(result.dealTerms.dealValue).toBeDefined();
            expect(result.dealTerms.dealValue.value).toBe('$1,500,000,000');
            expect(result.dealTerms.buyer.name).toBe('Ronny Dio Industries');
            expect(result.dealTerms.seller.name).toBe('Jack Black Hill Corp');

            // Assertions for dates
            expect(result.dealTerms.dates.signing).toBe('2025-07-24');
            expect(result.dealTerms.dates.closing).toBe('2025-09-01');
            expect(result.dealTerms.dates.longStopDate).toBe('2025-09-15');

            // Assertions for conditions
            expect(result.dealTerms.conditions).toBeDefined();
            expect(result.dealTerms.conditions).toBeInstanceOf(Array);
            expect(result.dealTerms.conditions.length).toBeGreaterThan(0);

            // Assertions for risk flags
            expect(result.riskFlags).toBeDefined();
            expect(result.riskFlags).toBeInstanceOf(Array);
            expect(result.riskFlags.length).toBeGreaterThan(0);

            // Assertions for extraction metadata
            expect(result.extractionMetadata).toBeDefined();
            expect(result.extractionMetadata.documentType).toBe('Legal Document');
            expect(result.extractionMetadata.confidence).toBeGreaterThan(0);
            expect(result.extractionMetadata.confidence).toBeLessThanOrEqual(1);
        } catch (error) {
            console.error('Test failed with error:', error);
            throw error;
        }
    }, 70000); 
});
