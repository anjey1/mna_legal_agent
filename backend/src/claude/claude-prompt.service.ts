/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DocumentSection } from './claude.interfaces';

@Injectable()
export class ClaudePromptService {
    createExtractionPrompt(documentSections: DocumentSection[]): string {
        const documentText = documentSections
            .map((section) => `${section.type.toUpperCase()}: ${section.content}`)
            .join('\n\n');

        return `Extract key deal terms from the following document. Focus on identifying:
            - Deal value
            - Buyer and seller details
            - Key dates (signing, closing, long stop)
            - Critical conditions

            Document:
            ${documentText}

            **Do not include any additional text, explanations, or formatting outside the JSON structure.**  
            Respond ONLY with a valid JSON matching the structure:
            {
            "dealTerms": {
                "dealValue": {
                    "value": "string",
                    "confidence": "0-1"
                },
                "buyer": {
                    "name": "string",
                    "type": "entity/individual"
                },
                "seller": {
                    "name": "string",
                    "type": "entity/individual"
                },
                "dates": {
                    "signing": "date",
                    "closing": "date",
                    "longStopDate": "date"
                },
                "conditions": [
                    "array of conditions with risk levels"
                ]
            }
        }`;
    }

    createValidationPrompt(extractedTerms: string): string {
        return `Cross-check and validate the extracted deal terms. 
    Verify:
    - Consistency of buyer/seller names
    - Plausibility of dates
    - Completeness of conditions
    
    Verification Instructions:
    1. Ensure all dates are valid and logically consistent
    2. Check buyer and seller names for accuracy
    3. Verify deal conditions are clear and comprehensive
    4. Adjust any inconsistent or missing information
    5. DO NOT include any explanatory text outside the JSON
    6. IMPORTANT: Respond ONLY with the JSON object, no additional text

    Extracted Terms:
    ${extractedTerms};

    **Do not include any additional text, explanations, or formatting outside the JSON structure.**  
    Respond ONLY with a valid JSON matching the structure:
    {
        "analysis": "The extracted deal terms seem mostly consistent and plausible.",
        "analysis_score": int 1-10
        "notes": [
            "The buyer and seller names are consistent throughout",
            "The dates are in chronological order and seem reasonable, allowing 1.5 months between signing and closing",
            "The conditions appear fairly complete for a deal of this size"
        ],
        "suggested_additions": [
            "Specifying amount of deposit refund if Buyer terminates",
            "Clarifying governing law/jurisdiction for the agreement",
            "Outlining non-compete terms for Seller"
        ],
        "risks": {
            "representations": [
                "Seller warrants full legal ownership of shares with no encumbrances",
                "Buyer assumes risk of regulatory approvals",
                "Seller liable for undisclosed Material Adverse Changes pre-closing"
            ],
            "indemnification": [
                "Seller indemnifies Buyer for breaches of reps/warranties for 18 months post-closing"
            ],
            "obligations": [
                "Seller responsible for obtaining required third-party consents"
            ],
            "governance": [
                "Agreement governed by Delaware law; disputes resolved in Delaware courts"
            ],
            "restrictive_covenants": [
                "Seller agrees not to compete with business for 3 years post-closing"
            ]
        }
    }`;
    }

    createRiskAnalysisPrompt(validatedTerms: string): string {
        return `Analyze the deal terms for potential risks. Identify:
    - Unusual clauses
    - Potential legal complications
    - Financial red flags

    Validated Terms:
    ${validatedTerms}
 
    **Do not include any additional text, explanations, or formatting outside the JSON structure.**  
    Respond with a JSON array of risk flags:
    [
        {
            "type": "unusual_term/legal_risk/financial_risk",
            "description": "Detailed explanation of the risk",
            "severity": "high/medium/low",
            "location": "section reference"
        }
    ]`;
    }
} 