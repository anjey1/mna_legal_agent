/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { RiskFlag } from './document-interfaces';

@Injectable()
export class DocumentValidationService {
    private readonly logger = new Logger(DocumentValidationService.name);

    validateDocumentData(filename: string, documentData: any): void {
        const errors: string[] = [];

        // Validate deal terms
        if (!documentData.dealTerms) {
            errors.push('Missing deal terms');
        } else {
            const dealTerms = documentData.dealTerms
            // Validate deal value
            if (!dealTerms.dealValue ||
                !dealTerms.dealValue.value) {
                errors.push('Invalid or missing deal value');
            }

            // Validate deal value confidence
            const confidenceValue = dealTerms.dealValue.confidence;
            const parsedConfidence = parseFloat(confidenceValue);
            if (isNaN(parsedConfidence) || parsedConfidence < 0 || parsedConfidence > 1) {
                errors.push('Invalid confidence value');
            }

            // Validate buyer information
            if (!dealTerms.buyer ||
                !dealTerms.buyer.name ||
                !dealTerms.buyer.type) {
                errors.push('Incomplete buyer information');
            }

            // Validate seller information
            if (!dealTerms.seller ||
                !dealTerms.seller.name ||
                !dealTerms.seller.type) {
                errors.push('Incomplete seller information');
            }

            // Validate dates
            const dates = dealTerms.dates || {};
            const requiredDateFields = ['signing', 'closing'];
            requiredDateFields.forEach(field => {
                if (!dates[field] || !this.isValidDate(dates[field])) {
                    errors.push(`Invalid or missing ${field} date`);
                }
            });

            // Validate conditions
            if (!dealTerms.conditions ||
                !Array.isArray(dealTerms.conditions) ||
                dealTerms.conditions.length === 0) {
                errors.push('Missing or empty conditions');
            }
        }

        // Validate extraction metadata
        if (!documentData.extractionMetadata) {
            errors.push('Missing extraction metadata');
        } else {
            const metadataConfidence = documentData.extractionMetadata.confidence;
            if (typeof metadataConfidence !== 'number' ||
                metadataConfidence < 0 ||
                metadataConfidence > 1) {
                errors.push('Invalid confidence score');
            }
        }

        // Validate risk flags
        if (!documentData.riskFlags || !Array.isArray(documentData.riskFlags)) {
            errors.push('Invalid or missing risk flags');
        }

        // Throw an error if any validation fails
        if (errors.length > 0) {
            this.logger.error(`Validation errors for ${filename}:`, errors);
            throw new Error(`Document validation failed: ${errors.join('; ')}`);
        }
    }

    isValidDate(dateString: string): boolean {
        // Check if the date string matches YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) return false;

        // Additional validation to ensure it's a valid date
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }

    validateRiskFlags(riskFlags: RiskFlag[]): RiskFlag[] {
        const validatedFlags: RiskFlag[] = [];
        const seenTypes = new Set<string>();

        for (const flag of riskFlags) {
            if (seenTypes.has(flag.type)) {
                this.logger.warn(`Duplicate risk flag type found: ${flag.type}. Skipping.`);
                continue;
            }
            seenTypes.add(flag.type);

            // Basic validation for severity
            if (flag.severity !== 'high' && flag.severity !== 'medium' && flag.severity !== 'low') {
                this.logger.warn(`Invalid severity for risk flag: ${flag.type}. Defaulting to 'medium'.`);
                validatedFlags.push({ ...flag, severity: 'medium' });
            } else {
                validatedFlags.push(flag);
            }

            // Basic validation for location
            if (!flag.location) {
                this.logger.warn(`Missing location for risk flag: ${flag.type}. Defaulting to 'unknown'.`);
                validatedFlags.push({ ...flag, location: 'unknown' });
            }
        }
        return validatedFlags;
    }

    parseClauseEnhancementResponse(responseText: any): any[] {
        try {
            // Extract JSON from code blocks or markdown if present
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)```/);
            const textToParse = jsonMatch ? jsonMatch[1] : responseText;

            // Attempt to parse
            const parsedJson = JSON.parse(textToParse.trim());

            // Validate the parsed response
            if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
                throw new Error('Invalid response format: Expected an array of suggestions');
            }

            // Validate and transform each suggestion
            return parsedJson.map(suggestion => ({
                version: suggestion.version || 'Unnamed Version',
                explanation: suggestion.explanation || 'No explanation provided',
                riskAnalysis: {
                    benefits: suggestion.benefits || [],
                    risks: this.validateRiskFlags(suggestion.risks || [])
                }
            }));
        } catch (error) {
            this.logger.error('Clause Enhancement Response Parsing Error', {
                originalText: responseText,
                parseError: error.message
            });

            // Fallback with a default suggestion
            return [{
                version: 'Default Suggestion',
                explanation: 'Unable to generate specific suggestions due to parsing error.',
                riskAnalysis: {
                    benefits: [],
                    risks: [{
                        type: 'parsing_error',
                        description: `Failed to parse clause suggestions: ${error.message}`,
                        severity: 'high',
                        location: 'entire_clause'
                    }]
                }
            }];
        }
    }
} 