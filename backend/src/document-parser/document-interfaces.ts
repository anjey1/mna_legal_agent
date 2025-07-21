/* eslint-disable prettier/prettier */
export interface RiskFlag {
    type: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    location: string;
}

export interface ProcessedDocument {
    filename: string;
    data: {
        dealTerms: {
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
        };
        riskFlags: RiskFlag[];
        extractionMetadata: {
            processingTime: number;
            documentType: string;
            confidence: number;
        };
    };
}

export interface ClauseEnhancementRequest {
    clause: string;
    perspective: 'buyer' | 'seller';
}

export interface ClauseSuggestion {
    version: string;
    explanation: string;
    riskAnalysis: {
        benefits: string[];
        risks: RiskFlag[];
    };
}

export interface ClauseEnhancementResponse {
    originalClause: string;
    suggestions: ClauseSuggestion[];
} 