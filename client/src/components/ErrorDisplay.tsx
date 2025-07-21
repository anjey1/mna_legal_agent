import React from 'react';

interface ErrorDisplayProps {
    error: string | null;
    onClose: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClose }) => {
    if (!error) return null;

    return (
        <div style={{
            color: 'red',
            backgroundColor: '#ffeeee',
            padding: '10px',
            marginTop: '10px',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <span>{error}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'red',
                    fontSize: '20px',
                    cursor: 'pointer'
                }}
            >
                ×
            </button>
        </div>
    );
}; 