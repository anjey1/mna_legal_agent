import React from 'react';

interface ModeToggleButtonProps {
    mode: 'upload' | 'enhance';
    toggleMode: () => void;
}

export const ModeToggleButton: React.FC<ModeToggleButtonProps> = ({ mode, toggleMode }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
        }}>
            <button
                onClick={toggleMode}
                style={{
                    backgroundColor: '#2196F3',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Switch to {mode === 'upload' ? 'Enhance Clause' : 'File Upload'}
            </button>
        </div>
    );
}; 