import { useState } from 'react';
import axios from 'axios';
import type { ProcessingResult } from '../types';

export function useClauseEnhancement() {
    const [clauseText, setClauseText] = useState<string>('');
    const [perspective, setPerspective] = useState<'buyer' | 'seller'>('buyer');
    const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

    const handleEnhanceClause = async () => {
        if (!clauseText.trim()) {
            setError('Clause text cannot be empty');
            return;
        }

        setIsEnhancing(true);
        setError(null);
        setProcessingResult(null);

        try {
            const response = await axios.post<ProcessingResult>('http://localhost:3000/api/documents/enhance-clause',
                {
                    clause: clauseText,
                    perspective: perspective
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            setProcessingResult(response.data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'An error occurred while enhancing clause');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsEnhancing(false);
        }
    };

    const resetClauseEnhancement = () => {
        setClauseText('');
        setProcessingResult(null);
        setError(null);
    };

    return {
        clauseText,
        setClauseText,
        perspective,
        setPerspective,
        processingResult,
        error,
        isEnhancing,
        handleEnhanceClause,
        resetClauseEnhancement,
        setError
    };
} 