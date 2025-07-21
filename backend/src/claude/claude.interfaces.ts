/* eslint-disable prettier/prettier */
export interface DocumentSection {
    type: 'header' | 'paragraph';
    content: string;
    level?: number;
}

export interface DealTerms {
    dealValue: {
        value: string;
        confidence: string;
    };
    buyer: {
        name: string;
        type: string;
    };
    seller: {
        name: string;
        type: string;
    };
    dates: {
        signing?: string;
        closing?: string;
        longStopDate?: string;
    };
    conditions: string[];
}

export interface RiskFlag {
    type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    location: string;
}

export interface AnalysisResult {
    dealTerms: DealTerms;
    riskFlags: RiskFlag[];
    extractionMetadata: {
        processingTime: number;
        documentType: string;
        confidence: number;
    };
}

export interface ClauseSuggestion {
    version: string;
    explanation: string;
    riskAnalysis: {
        benefits: string[];
        risks: RiskFlag[];
    };
}

export interface ClauseEnhancementRequest {
    clause: string;
    perspective: 'buyer' | 'seller';
}

export interface ClauseEnhancementResult {
    originalClause: string;
    suggestions: ClauseSuggestion[];
} 