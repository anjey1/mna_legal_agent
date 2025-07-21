import React from 'react';
import { ErrorDisplay } from './ErrorDisplay';

interface ClauseEnhancementPanelProps {
    clauseText: string;
    setClauseText: (text: string) => void;
    perspective: 'buyer' | 'seller';
    setPerspective: (perspective: 'buyer' | 'seller') => void;
    error: string | null;
    isEnhancing: boolean;
    onEnhanceClause: () => void;
    onErrorClose: () => void;
}

export const ClauseEnhancementPanel: React.FC<ClauseEnhancementPanelProps> = ({
    clauseText,
    setClauseText,
    perspective,
    setPerspective,
    error,
    isEnhancing,
    onEnhanceClause,
    onErrorClose
}) => {
    return (
        <div style={{
            maxWidth: '90%',
            margin: '0 auto'
        }}>
            <h1>Enter a clause to enhance</h1>
            {/* Perspective Toggle */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0'
                }}>
                    <button
                        onClick={() => setPerspective('buyer')}
                        style={{
                            backgroundColor: perspective === 'buyer' ? '#2196F3' : 'transparent',
                            color: perspective === 'buyer' ? 'white' : '#333',
                            padding: '10px 20px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: perspective === 'buyer' ? 'bold' : 'normal'
                        }}
                    >
                        Buyer Perspective
                    </button>
                    <div style={{
                        width: '1px',
                        backgroundColor: '#e0e0e0'
                    }} />
                    <button
                        onClick={() => setPerspective('seller')}
                        style={{
                            backgroundColor: perspective === 'seller' ? '#2196F3' : 'transparent',
                            color: perspective === 'seller' ? 'white' : '#333',
                            padding: '10px 20px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontWeight: perspective === 'seller' ? 'bold' : 'normal'
                        }}
                    >
                        Seller Perspective
                    </button>
                </div>
            </div>
            <textarea
                placeholder="Enter clause to enhance..."
                value={clauseText}
                onChange={(e) => setClauseText(e.target.value)}
                style={{
                    width: '100%',
                    minHeight: '200px',
                    marginBottom: '20px',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                }}
            />

            <ErrorDisplay
                error={error}
                onClose={onErrorClose}
            />

            <button
                onClick={onEnhanceClause}
                disabled={isEnhancing}
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isEnhancing ? 'not-allowed' : 'pointer'
                }}
            >
                {isEnhancing ? 'Enhancing...' : 'Enhance Clause'}
            </button>
        </div>
    );
}; 