/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
 
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import {
  DocumentSection,
  AnalysisResult,
  ClauseEnhancementRequest,
  ClauseEnhancementResult
} from './claude.interfaces';
import { ClaudePromptService } from './claude-prompt.service';
import { ClaudeJsonParserService } from './claude-json-parser.service';
import { ClaudeConfidenceService } from './claude-confidence.service';
import { ClaudeApiService } from './claude-api.service';

@Injectable()
export class ClaudeService {
  private readonly logger = new Logger(ClaudeService.name);

  constructor(
    private promptService: ClaudePromptService,
    private jsonParserService: ClaudeJsonParserService,
    private confidenceService: ClaudeConfidenceService,
    private apiService: ClaudeApiService
  ) { }

  async processDocument(
    documentSections: DocumentSection[],
  ): Promise<AnalysisResult> {
    const startTime = Date.now();

    try {
      // Step 1: Extraction Prompt
      const extractionResponse = await this.apiService.callClaudeAPI(
        this.promptService.createExtractionPrompt(documentSections),
      );
      this.logger.log('Extraction Response: ' + extractionResponse);

      // Validate JSON for extraction
      const dealTerms = this.jsonParserService.safeParseJSON(
        extractionResponse,
        'Extraction',
      ) as { dealTerms: any };

      // Step 2: Validation Prompt
      const validationResponse = await this.apiService.callClaudeAPI(
        this.promptService.createValidationPrompt(JSON.stringify(dealTerms)),
      );
      this.logger.log('Validation Response: ' + validationResponse);

      // Validate JSON for validation
      const validatedTerms = this.jsonParserService.safeParseJSON(validationResponse, 'Validation');

      // Step 3: Risk Analysis Prompt
      const riskAnalysisResponse = await this.apiService.callClaudeAPI(
        this.promptService.createRiskAnalysisPrompt(JSON.stringify(validatedTerms)),
      );
      this.logger.log('Risk Analysis Response: ' + riskAnalysisResponse);

      // Validate JSON for risk analysis
      const riskFlags = this.jsonParserService.parseRiskArray(
        riskAnalysisResponse,
        'Risk Analysis',
      );

      const processedDealTerms = dealTerms.dealTerms;

      // Combine results
      const result: AnalysisResult = {
        dealTerms: processedDealTerms,
        riskFlags,
        extractionMetadata: {
          processingTime: Date.now() - startTime,
          documentType: this.confidenceService.detectDocumentType(documentSections),
          confidence: this.confidenceService.calculateConfidence(
            documentSections,
            Number(processedDealTerms.dealValue.confidence),
            processedDealTerms.conditions,
            riskFlags
          ),
        },
      };

      return result;
    } catch (error) {
      this.logger.error('Claude API Processing Error', error.stack);

      if (error.response) {
        this.logger.error('Claude API Response Error', {
          status: error.response.status,
          data: error.response.data,
        });
      }

      throw new Error(
        `Failed to process document with Claude: ${error.message}`,
      );
    }
  }

  async enhanceClause(
    request: ClauseEnhancementRequest,
  ): Promise<ClauseEnhancementResult> {
    try {
      const enhancementPrompt = `Enhance the following clause from a ${request.perspective}'s perspective:

            Original Clause: ${request.clause}

            Detailed Enhancement Instructions:
            1. Generate 2-3 improved versions of the clause
            2. For each version, provide:
            a. Detailed explanation of improvements
            b. Specific benefits for the ${request.perspective}
            c. Potential risks or drawbacks
            3. Ensure suggestions are:
            - Legally sound
            - Balanced
            - Actionable
            4. Respond **ONLY** with a valid JSON matching the structure below. **Do not include any additional text, explanations, or formatting outside the JSON structure.**

                Required JSON Structure:
                [
                    {
                        "version": "Descriptive Name of Clause Version",
                        "explanation": "Detailed description of improvements",
                        "riskAnalysis": {
                            "benefits": ["Benefit 1", "Benefit 2"],
                            "risks": [
                                {
                                    "type": "risk_category",
                                    "description": "Detailed risk description",
                                    "severity": "high/medium/low",
                                    "location": "specific_clause_section"
                                }
                            ]
                        }
                    }
                ]`;

      // Call Claude API for clause enhancement
      const enhancementResponse = await this.apiService.callClaudeAPI(enhancementPrompt);

      // Parse the response
      const suggestions = this.jsonParserService.parseClauseSuggestions(enhancementResponse);

      // Return structured result
      return {
        originalClause: request.clause,
        suggestions: suggestions,
      };
    } catch (error) {
      this.logger.error('Clause Enhancement Error', {
        message: error.message,
        stack: error.stack,
      });

      // Provide a fallback suggestion in case of error
      return {
        originalClause: request.clause,
        suggestions: [
          {
            version: 'Default Suggestion',
            explanation:
              'Unable to generate specific suggestions due to processing error.',
            riskAnalysis: {
              benefits: [],
              risks: [
                {
                  type: 'processing_error',
                  description: `Clause enhancement failed: ${error.message}`,
                  severity: 'high',
                  location: 'entire_clause',
                },
              ],
            },
          },
        ],
      };
    }
  }
}
