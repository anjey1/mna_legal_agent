/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DocumentSection, RiskFlag } from './claude.interfaces';

@Injectable()
export class ClaudeConfidenceService {
    calculateConfidence(
        sections: DocumentSection[],
        llm_confidence: number,
        conditions: string[],
        riskFlags: RiskFlag[]
    ): number {
        // Comprehensive confidence calculation
        const sectionCount = sections.length;
        const headerCount = sections.filter((s) => s.type === 'header').length;

        // Section structure factor
        const structureFactor = Math.min(0.3, (sectionCount * headerCount) / 100);

        // Conditions factor
        const conditionsFactor = conditions && conditions.length > 0
            ? Math.min(0.2, conditions.length * 0.05)
            : 0;

        // Risk flags factor (penalize high-severity risks)
        const riskFactor = riskFlags
            ? riskFlags.reduce((acc, flag) => {
                switch (flag.severity) {
                    case 'high': return acc - 0.15;
                    case 'medium': return acc - 0.05;
                    case 'low': return acc - 0.01;
                    default: return acc;
                }
            }, 0.2)
            : 0.2;

        // LLM confidence factor
        const llmConfidenceFactor = llm_confidence || 0.5;

        // Combine factors with weighted average
        const confidence = (
            structureFactor * 0.3 +  // Document structure
            conditionsFactor * 0.2 + // Conditions completeness
            riskFactor * 0.2 +        // Risk assessment
            llmConfidenceFactor * 0.3 // LLM's inherent confidence
        );

        // Ensure confidence is between 0 and 1
        return Math.max(0, Math.min(1, confidence));
    }

    detectDocumentType(sections: DocumentSection[]): string {
        // Simple heuristic to detect document type
        const headerTypes = sections
            .filter((s) => s.type === 'header')
            .map((s) => s.content.toLowerCase());

        if (
            headerTypes.some((h) => h.includes('merger') || h.includes('acquisition'))
        ) {
            return 'Merger & Acquisition Agreement';
        }
        return 'Legal Document';
    }
} 