/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    HttpException,
    HttpStatus,
    Logger,
    Body
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentParserService } from './document-parser.service';
import { ClaudeService } from '../claude/claude.service';
import { DocumentValidationService } from './document-validation.service';
import {
    ProcessedDocument,
    ClauseEnhancementRequest,
    ClauseEnhancementResponse
} from './document-interfaces';

@Controller('api/documents')
export class UploadController {
    private readonly logger = new Logger(UploadController.name);

    constructor(
        private documentParserService: DocumentParserService,
        private claudeService: ClaudeService,
        private documentValidationService: DocumentValidationService
    ) { }

    @Post('analyze')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<{
        message: string;
        documents: ProcessedDocument[];
    }> {
        this.logger.log(`Received ${files ? files.length : 0} files for processing`);

        if (!files || files.length === 0) {
            this.logger.error('No files uploaded');
            throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
        }

        try {
            // Process each file
            const processedDocuments: ProcessedDocument[] = await Promise.all(
                files.map(async (file) => {
                    this.logger.log(`Processing file: ${file.originalname}`);

                    // Extract text with section preservation
                    const documentSections = await this.documentParserService.extractText(file);

                    // Process text with Claude's multi-step analysis
                    const claudeResponse = await this.claudeService.processDocument(documentSections);

                    // Validate extracted document data
                    this.documentValidationService.validateDocumentData(file.originalname, claudeResponse);

                    return {
                        filename: file.originalname,
                        data: claudeResponse
                    };
                })
            );

            return {
                message: 'Files processed successfully',
                documents: processedDocuments
            };
        } catch (error) {
            this.logger.error(`Upload processing error: ${error.message}`, error.stack);
            throw new HttpException(
                `Document processing error: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post('enhance-clause')
    async enhanceClause(
        @Body() request: ClauseEnhancementRequest
    ): Promise<ClauseEnhancementResponse> {
        this.logger.log(`Enhancing clause from ${request.perspective} perspective`);

        if (!request.clause || !request.perspective) {
            throw new HttpException('Clause text and perspective are required', HttpStatus.BAD_REQUEST);
        }

        try {
            // Call Claude service with the enhancement prompt
            const enhancementResponse = await this.claudeService.enhanceClause({
                clause: `${request.clause}`,
                perspective: `${request.perspective}`
            });

            return {
                originalClause: enhancementResponse.originalClause,
                suggestions: enhancementResponse.suggestions
            };
        } catch (error) {
            this.logger.error(`Clause enhancement error: ${error.message}`, error.stack);
            throw new HttpException(
                `Clause enhancement failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
} 