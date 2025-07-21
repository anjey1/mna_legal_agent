/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { RiskFlag } from './claude.interfaces';

@Injectable()
export class ClaudeJsonParserService {
    private readonly logger = new Logger(ClaudeJsonParserService.name);

    parseRiskArray(text: string, stage: string = 'Unknown'): RiskFlag[] {
        try {
            // Extract the JSON array portion
            const arrayStart = text.indexOf('[');
            const arrayEnd = text.lastIndexOf(']') + 1;

            if (arrayStart === -1 || arrayEnd === 0) {
                throw new Error('No array found in text');
            }

            const jsonArrayText = text.slice(arrayStart, arrayEnd);
            const parsedArray = JSON.parse(jsonArrayText);

            if (!Array.isArray(parsedArray)) {
                throw new Error('Parsed content is not an array');
            }

            // Validate each risk flag
            const validatedRiskFlags: RiskFlag[] = parsedArray.map((flag: any) => {
                // Ensure each flag has the required properties with default values
                return {
                    type: flag.type || 'unknown_risk',
                    description: flag.description || 'Unspecified risk',
                    severity: ['high', 'medium', 'low'].includes(flag.severity)
                        ? flag.severity
                        : 'medium',
                    location: flag.location || 'document',
                };
            });

            return validatedRiskFlags;
        } catch (error) {
            // Log the error with stage information
            this.logger.error(`JSON Array Parsing Error in ${stage} Stage`, {
                originalText: text,
                parseError: error.message,
            });

            // Return a default risk flag with the error message
            return [
                {
                    type: 'parsing_error',
                    description: `Failed to parse risk flags: ${error.message}`,
                    severity: 'high',
                    location: stage,
                },
            ];
        }
    }

    safeParseJSON(responseText: string, stage: string): any {
        try {
            // Extract JSON from code blocks or markdown if present
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)```/);
            const textToParse = jsonMatch ? jsonMatch[1] : responseText;

            // Remove any leading/trailing whitespace
            const cleanedText = textToParse.trim();

            // Attempt to parse
            const parsedJson = JSON.parse(cleanedText);

            // Additional validation can be added here
            if (!parsedJson) {
                throw new Error('Parsed JSON is null or undefined');
            }

            return parsedJson;
        } catch (parseError) {
            this.logger.error(`JSON Parsing Error in ${stage} Stage`, {
                originalText: responseText,
                parseError: parseError.message,
            });

            throw new Error(`Invalid JSON in ${stage} Stage: ${parseError.message}`);
        }
    }

    parseClauseSuggestions(responseText: string) {
        try {
            // Extract JSON from code blocks or markdown if present
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)```/);
            const textToParse = jsonMatch ? jsonMatch[1] : responseText;

            // Attempt to parse
            const parsedJson = JSON.parse(textToParse.trim());

            // Validate the parsed response
            if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
                throw new Error(
                    'Invalid response format: Expected an array of suggestions',
                );
            }

            // Validate and transform each suggestion
            return parsedJson.map((suggestion) => ({
                version: suggestion.version || 'Unnamed Version',
                explanation: suggestion.explanation || 'No explanation provided',
                riskAnalysis: {
                    benefits: suggestion.riskAnalysis?.benefits || [],
                    risks: suggestion.riskAnalysis?.risks || [],
                },
            }));
        } catch (error) {
            this.logger.error('Clause Suggestions Parsing Error', {
                originalText: responseText,
                parseError: error.message,
            });

            // Fallback with a default suggestion
            return [
                {
                    version: 'Default Suggestion',
                    explanation:
                        'Unable to generate specific suggestions due to parsing error.',
                    riskAnalysis: {
                        benefits: [],
                        risks: [
                            {
                                type: 'parsing_error',
                                description: `Failed to parse clause suggestions: ${error.message}`,
                                severity: 'high',
                                location: 'entire_clause',
                            },
                        ],
                    },
                },
            ];
        }
    }
} 