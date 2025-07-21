import React from 'react';
import type { ProcessingResult } from '../types';

interface ProcessingResultDisplayProps {
    result: ProcessingResult;
}

export const ProcessingResultDisplay: React.FC<ProcessingResultDisplayProps> = ({ result }) => {
    return (
        <div style={{
            marginTop: '20px',
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3>Processing Result:</h3>
            <pre style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                maxHeight: '300px',
                overflowY: 'auto'
            }}>
                {JSON.stringify(result, null, 2)}
            </pre>
        </div>
    );
}; 